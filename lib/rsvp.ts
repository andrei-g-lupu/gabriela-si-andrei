import type { Lang } from "@/lib/i18n"

export type RsvpPayload = {
  firstName: string
  lastName: string
  email: string
  events: string[]
  plusOne: boolean
  plusOneName: string
  withKids: boolean
  kidsCount: number
  diet: string[]
  dietOther: string
  lang: Lang
}

const VALID_EVENTS = new Set(["1", "2"])
const VALID_DIET_OPTIONS = new Set([
  "none",
  "noMeat",
  "noPork",
  "noFish",
  "vegetarian",
  "vegan",
  "glutenFree",
  "lactoseFree",
  "other",
])
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_NAME_LENGTH = 80
const MAX_EMAIL_LENGTH = 254
const MAX_PLUS_ONE_NAME_LENGTH = 120
const MAX_DIET_OTHER_LENGTH = 300
const MIN_FORM_FILL_MS = 3000

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export function validateRsvpPayload(
  body: unknown,
):
  | { ok: true; data: RsvpPayload }
  | { ok: false; error: string } {
  if (!isRecord(body)) {
    return { ok: false, error: "Invalid request body" }
  }

  const firstName = String(body.firstName ?? "").trim()
  const lastName = String(body.lastName ?? "").trim()
  const email = String(body.email ?? "").trim()
  const lang = body.lang
  const website = String(body.website ?? "").trim()
  const formStartedAt = Number(body.formStartedAt ?? 0)

  if (!firstName || !lastName || !email) {
    return { ok: false, error: "Missing required fields" }
  }

  if (website) {
    return { ok: false, error: "Invalid request" }
  }

  if (
    !Number.isFinite(formStartedAt) ||
    Date.now() - formStartedAt < MIN_FORM_FILL_MS
  ) {
    return { ok: false, error: "Invalid request timing" }
  }

  if (
    firstName.length > MAX_NAME_LENGTH ||
    lastName.length > MAX_NAME_LENGTH ||
    email.length > MAX_EMAIL_LENGTH
  ) {
    return { ok: false, error: "Field too long" }
  }

  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "Invalid email" }
  }

  if (lang !== "ro" && lang !== "en") {
    return { ok: false, error: "Invalid language" }
  }

  const events = Array.isArray(body.events)
    ? body.events.map(String)
    : []
  if (
    events.length === 0 ||
    events.length > VALID_EVENTS.size ||
    !events.every((event) => VALID_EVENTS.has(event))
  ) {
    return { ok: false, error: "Invalid events" }
  }

  const plusOne = Boolean(body.plusOne)
  const plusOneName = String(body.plusOneName ?? "").trim()
  const withKids = Boolean(body.withKids)

  if (plusOneName.length > MAX_PLUS_ONE_NAME_LENGTH) {
    return { ok: false, error: "Plus-one name too long" }
  }

  let kidsCount = Number(body.kidsCount ?? 0)
  if (!Number.isInteger(kidsCount)) kidsCount = 0
  if (withKids) {
    kidsCount = Math.min(10, Math.max(1, kidsCount))
  } else {
    kidsCount = 0
  }

  const diet = Array.isArray(body.diet) ? body.diet.map(String) : []
  const dietOther = String(body.dietOther ?? "").trim()

  if (!diet.every((option) => VALID_DIET_OPTIONS.has(option))) {
    return { ok: false, error: "Invalid diet option" }
  }

  if (diet.includes("none") && diet.length > 1) {
    return { ok: false, error: "Invalid diet combination" }
  }

  if (dietOther.length > MAX_DIET_OTHER_LENGTH) {
    return { ok: false, error: "Diet description too long" }
  }

  if (diet.includes("other") && !dietOther) {
    return { ok: false, error: "Diet other description required" }
  }

  return {
    ok: true,
    data: {
      firstName,
      lastName,
      email,
      events: [...new Set(events)],
      plusOne,
      plusOneName,
      withKids,
      kidsCount,
      diet: [...new Set(diet)],
      dietOther,
      lang,
    },
  }
}

export function toRsvpRow(data: RsvpPayload) {
  return {
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email.toLowerCase(),
    events: data.events,
    plus_one: data.plusOne,
    plus_one_name: data.plusOne && data.plusOneName ? data.plusOneName : null,
    with_kids: data.withKids,
    kids_count: data.kidsCount,
    diet: data.diet,
    diet_other:
      data.diet.includes("other") && data.dietOther ? data.dietOther : null,
    lang: data.lang,
  }
}

/** Total headcount: guest + optional plus-one + kids */
export function getGuestCount(
  data: Pick<RsvpPayload, "plusOne" | "withKids" | "kidsCount">,
) {
  return 1 + (data.plusOne ? 1 : 0) + (data.withKids ? data.kidsCount : 0)
}
