import { createClient } from "@supabase/supabase-js"
import type { SupabaseClient } from "@supabase/supabase-js"

import { getSupabaseBrowserEnv } from "@/lib/supabase/env"

/**
 * Browser Supabase client (publishable key, RLS applies).
 * Not needed for RSVP v1 — the form posts to `/api/rsvp` instead.
 */
export function createBrowserSupabaseClient(): SupabaseClient {
  const { url, publishableKey } = getSupabaseBrowserEnv()

  return createClient(url, publishableKey)
}
