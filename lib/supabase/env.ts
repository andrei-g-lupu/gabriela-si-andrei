function requireEnv(name: string): string {
  const value = process.env[name]?.trim()
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`)
  }
  return value
}

/** Server-side Supabase config (from `.env.local`). */
export function getSupabaseEnv() {
  return {
    url: requireEnv("SUPABASE_URL"),
    publishableKey: requireEnv("SUPABASE_PUBLISHABLE_KEY"),
    secretKey: requireEnv("SUPABASE_SECRET_KEY"),
  }
}

/** Browser-safe config — only available when `NEXT_PUBLIC_*` vars are set. */
export function getSupabaseBrowserEnv() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ??
    process.env.SUPABASE_URL?.trim()
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ??
    process.env.SUPABASE_PUBLISHABLE_KEY?.trim()

  if (!url || !publishableKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    )
  }

  return { url, publishableKey }
}
