import { NextResponse } from "next/server"

import { sendRsvpConfirmation } from "@/lib/email/send-rsvp-confirmation"
import { toRsvpRow, validateRsvpPayload } from "@/lib/rsvp"
import { createAdminSupabaseClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
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
  const supabase = createAdminSupabaseClient()

  const { data: existing } = await supabase
    .from("rsvps")
    .select("id")
    .eq("email", row.email)
    .maybeSingle()

  const { data, error } = existing
    ? await supabase
        .from("rsvps")
        .update(row)
        .eq("id", existing.id)
        .select("id")
        .single()
    : await supabase.from("rsvps").insert(row).select("id").single()

  if (error) {
    console.error("RSVP save failed:", error.message)
    return NextResponse.json({ error: "server" }, { status: 500 })
  }

  const { sent: emailSent } = await sendRsvpConfirmation(parsed.data)

  return NextResponse.json({
    ok: true,
    id: data.id,
    updated: Boolean(existing),
    emailSent,
  })
}
