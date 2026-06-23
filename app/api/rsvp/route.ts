import { NextResponse } from "next/server"

import { sendRsvpConfirmation } from "@/lib/email/send-rsvp-confirmation"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"
import { toRsvpRow, validateRsvpPayload } from "@/lib/rsvp"
import { createAdminSupabaseClient } from "@/lib/supabase/server"

const MAX_BODY_BYTES = 8 * 1024
const IP_RATE_LIMIT = { limit: 10, windowMs: 10 * 60 * 1000 }
const EMAIL_RATE_LIMIT = { limit: 2, windowMs: 60 * 60 * 1000 }

function rateLimitedResponse(retryAfterSeconds: number) {
  return NextResponse.json(
    { error: "rate_limited" },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfterSeconds) },
    },
  )
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0)
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "payload_too_large" }, { status: 413 })
  }

  const clientIp = getClientIp(request)
  const ipLimit = await checkRateLimit(
    `rsvp:ip:${clientIp}`,
    IP_RATE_LIMIT.limit,
    IP_RATE_LIMIT.windowMs,
  )

  if (!ipLimit.allowed) {
    return rateLimitedResponse(ipLimit.retryAfterSeconds)
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 })
  }

  const parsed = validateRsvpPayload(body)
  if (!parsed.ok) {
    return NextResponse.json({ error: "validation" }, { status: 400 })
  }

  const row = toRsvpRow(parsed.data)
  const emailLimit = await checkRateLimit(
    `rsvp:email:${row.email}`,
    EMAIL_RATE_LIMIT.limit,
    EMAIL_RATE_LIMIT.windowMs,
  )

  if (!emailLimit.allowed) {
    return rateLimitedResponse(emailLimit.retryAfterSeconds)
  }

  const supabase = createAdminSupabaseClient()

  const { data: existing, error: existingError } = await supabase
    .from("rsvps")
    .select("id")
    .eq("email", row.email)
    .maybeSingle()

  if (existingError) {
    console.error("RSVP lookup failed:", existingError.message)
    return NextResponse.json({ error: "server" }, { status: 500 })
  }

  if (existing) {
    return NextResponse.json({ error: "already_submitted" }, { status: 409 })
  }

  const { data, error } = await supabase
    .from("rsvps")
    .insert(row)
    .select("id")
    .single()

  if (error) {
    console.error("RSVP save failed:", error.message)
    return NextResponse.json({ error: "server" }, { status: 500 })
  }

  const { sent: emailSent } = await sendRsvpConfirmation(parsed.data)

  return NextResponse.json({
    ok: true,
    id: data.id,
    updated: false,
    emailSent,
  })
}
