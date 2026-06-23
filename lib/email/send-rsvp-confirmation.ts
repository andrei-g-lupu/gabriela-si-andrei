import { Resend } from "resend"

import { translations, type Lang } from "@/lib/i18n"
import { getGuestCount, type RsvpPayload } from "@/lib/rsvp"

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}

function buildDietLabels(data: RsvpPayload, lang: Lang) {
  const t = translations[lang]
  const labels: string[] = data.diet
    .filter((key) => key !== "other")
    .map((key) => {
      const option = t.rsvp.dietOptions[key as keyof typeof t.rsvp.dietOptions]
      return option ?? key
    })

  if (data.diet.includes("other") && data.dietOther.trim()) {
    labels.push(data.dietOther.trim())
  }

  return labels.length > 0 ? labels.join(", ") : t.email.noDiet
}

function getSelectedEvents(data: RsvpPayload, lang: Lang) {
  const t = translations[lang]

  return data.events
    .map((key) => Number(key) - 1)
    .filter((index) => t.timeline.events[index])
    .sort((a, b) => a - b)
    .map((index) => t.timeline.events[index])
}

function buildHtml(data: RsvpPayload) {
  const t = translations[data.lang]
  const guestCount = getGuestCount(data)
  const guestLabel = guestCount === 1 ? t.common.person : t.common.people
  const kidsLabel = data.kidsCount === 1 ? t.common.kid : t.common.kids
  const selectedEvents = getSelectedEvents(data, data.lang)
  const dietLabels = buildDietLabels(data, data.lang)

  const detailRow = (label: string, value: string) => `
    <tr>
      <td style="padding:8px 0;color:#8a6f63;font-weight:600;width:140px;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:8px 0;color:#4a3b35;">${escapeHtml(value)}</td>
    </tr>`

  const optionalRows = [
    data.plusOne
      ? detailRow(
          t.email.plusOne,
          data.plusOneName.trim()
            ? `${t.rsvp.yes} · ${data.plusOneName.trim()}`
            : t.rsvp.yes,
        )
      : "",
    data.withKids
      ? detailRow(t.email.kids, `${data.kidsCount} ${kidsLabel}`)
      : "",
  ].join("")

  const itineraryRows = selectedEvents
    .map(
      (event) => `
        <tr>
          <td style="padding:14px 0;border-top:1px solid #efd9cc;vertical-align:top;width:72px;color:#c98f73;font-weight:700;font-size:16px;">${escapeHtml(event.time)}</td>
          <td style="padding:14px 0;border-top:1px solid #efd9cc;color:#4a3b35;">
            <p style="margin:0 0 4px;font-weight:700;font-size:16px;">${escapeHtml(event.title)}</p>
            <p style="margin:0 0 6px;color:#6f5b52;">${escapeHtml(event.place)}</p>
            <p style="margin:0 0 8px;color:#8a6f63;font-size:14px;line-height:1.5;">${escapeHtml(event.desc)}</p>
            <a href="${escapeHtml(event.map)}" style="color:#c98f73;font-weight:700;text-decoration:none;">${escapeHtml(t.timeline.mapLabel)}</a>
          </td>
        </tr>`,
    )
    .join("")

  return `<!DOCTYPE html>
<html lang="${data.lang}">
  <body style="margin:0;padding:0;background:#f7e3d8;font-family:Georgia,'Times New Roman',serif;color:#4a3b35;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f7e3d8;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#fff8f4;border:1px solid #e8cbb9;border-radius:24px;overflow:hidden;">
            <tr>
              <td style="padding:32px 28px 12px;text-align:center;">
                <p style="margin:0 0 8px;font-size:28px;color:#c98f73;">${escapeHtml(t.email.names)}</p>
                <h1 style="margin:0;font-size:24px;font-weight:600;color:#4a3b35;">${escapeHtml(t.email.subject)}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 28px 28px;font-size:16px;line-height:1.6;">
                <p style="margin:0 0 16px;">
                  ${escapeHtml(t.email.greeting)} ${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)},
                </p>
                <p style="margin:0 0 20px;color:#6f5b52;">${escapeHtml(t.email.body1)}</p>
                <div style="border:1px solid #e8cbb9;border-radius:16px;padding:18px 20px;background:#fffdfb;margin-bottom:18px;">
                  <p style="margin:0 0 12px;font-weight:700;color:#4a3b35;">${escapeHtml(t.email.detailsTitle)}</p>
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:15px;">
                    ${detailRow(t.email.guests, `${guestCount} ${guestLabel}`)}
                    ${optionalRows}
                    ${detailRow(t.email.diet, dietLabels)}
                  </table>
                </div>
                <div style="border:1px solid #e8cbb9;border-radius:16px;padding:18px 20px;background:#fffdfb;">
                  <p style="margin:0 0 4px;font-weight:700;color:#4a3b35;">${escapeHtml(t.timeline.title)}</p>
                  <p style="margin:0 0 12px;color:#8a6f63;font-size:14px;">${escapeHtml(t.timeline.subtitle)}</p>
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:15px;">
                    ${itineraryRows}
                  </table>
                </div>
                <p style="margin:20px 0 0;color:#6f5b52;">${escapeHtml(t.email.body2)}</p>
                <p style="margin:24px 0 4px;color:#6f5b52;">${escapeHtml(t.email.signature)}</p>
                <p style="margin:0;font-size:22px;color:#c98f73;">${escapeHtml(t.email.names)}</p>
                <p style="margin:16px 0 0;font-size:14px;color:#8a6f63;">${escapeHtml(t.hero.date)} · ${escapeHtml(t.hero.city)}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

export async function sendRsvpConfirmation(
  data: RsvpPayload,
): Promise<{ sent: true } | { sent: false; reason: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const from = process.env.RSVP_FROM_EMAIL?.trim()

  if (!apiKey || !from) {
    return { sent: false, reason: "missing_email_config" }
  }

  const t = translations[data.lang]
  const resend = new Resend(apiKey)

  const { error } = await resend.emails.send({
    from,
    to: data.email,
    subject: t.email.subject,
    html: buildHtml(data),
  })

  if (error) {
    return { sent: false, reason: error.message }
  }

  return { sent: true }
}
