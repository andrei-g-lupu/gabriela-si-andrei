type RateLimitResult = {
  allowed: boolean
  retryAfterSeconds: number
}

type MemoryEntry = {
  count: number
  resetAt: number
}

const memoryStore = new Map<string, MemoryEntry>()

function getRetryAfter(resetAt: number) {
  return Math.max(1, Math.ceil((resetAt - Date.now()) / 1000))
}

async function checkUpstashRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim()
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim()

  if (!url || !token) {
    return null
  }

  const redisKey = `rate-limit:${key}`
  const response = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      ["INCR", redisKey],
      ["PEXPIRE", redisKey, windowMs, "NX"],
      ["PTTL", redisKey],
    ]),
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error("Rate limit store unavailable")
  }

  const results = (await response.json()) as Array<{ result: unknown }>
  const count = Number(results[0]?.result ?? 0)
  const ttl = Number(results[2]?.result ?? windowMs)

  return {
    allowed: count <= limit,
    retryAfterSeconds: Math.max(1, Math.ceil(ttl / 1000)),
  }
}

function checkMemoryRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now()
  const existing = memoryStore.get(key)

  if (!existing || existing.resetAt <= now) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, retryAfterSeconds: Math.ceil(windowMs / 1000) }
  }

  existing.count += 1
  return {
    allowed: existing.count <= limit,
    retryAfterSeconds: getRetryAfter(existing.resetAt),
  }
}

export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const normalizedKey = key.toLowerCase().replaceAll(/[^a-z0-9:._-]/g, "_")

  try {
    const upstashResult = await checkUpstashRateLimit(
      normalizedKey,
      limit,
      windowMs,
    )

    if (upstashResult) {
      return upstashResult
    }
  } catch (error) {
    console.error(
      "Rate limit check failed:",
      error instanceof Error ? error.message : error,
    )
    return { allowed: false, retryAfterSeconds: 60 }
  }

  return checkMemoryRateLimit(normalizedKey, limit, windowMs)
}

export function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")
  const firstForwardedIp = forwardedFor?.split(",")[0]?.trim()

  return (
    firstForwardedIp ||
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    "unknown"
  )
}
