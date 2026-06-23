import { createAdminClient } from "@supabase/server/core"
import type { SupabaseClient } from "@supabase/supabase-js"

import { getSupabaseEnv } from "@/lib/supabase/env"

/**
 * Admin Supabase client for API routes and server actions.
 * Bypasses RLS — use only on the server, never in the browser.
 */
export function createAdminSupabaseClient(): SupabaseClient {
  const { url, secretKey } = getSupabaseEnv()

  return createAdminClient({
    env: {
      url,
      secretKeys: { default: secretKey },
    },
  })
}
