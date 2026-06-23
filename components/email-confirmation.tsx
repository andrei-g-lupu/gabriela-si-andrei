"use client"

import { Check, Mail } from "lucide-react"
import type { RsvpData } from "@/components/rsvp-form"
import { useLanguage } from "@/components/language-provider"
import { StableText } from "@/components/stable-text"
import { Button } from "@/components/ui/button"
import { tBoth, translations } from "@/lib/i18n"
import { getGuestCount } from "@/lib/rsvp"

export function EmailConfirmation({
  data,
  onReset,
}: {
  data: RsvpData
  onReset: () => void
}) {
  const { t } = useLanguage()

  const dietKeys = data.diet as (keyof typeof t.rsvp.dietOptions)[]
  const dietLabelsRo = dietKeys
    .filter((k) => k !== "other")
    .map((k) => translations.ro.rsvp.dietOptions[k])
  const dietLabelsEn = dietKeys
    .filter((k) => k !== "other")
    .map((k) => translations.en.rsvp.dietOptions[k])
  if (data.diet.includes("other") && data.dietOther.trim()) {
    dietLabelsRo.push(data.dietOther.trim())
    dietLabelsEn.push(data.dietOther.trim())
  }

  const eventIndices = data.events
    .map((e) => Number(e) - 1)
    .sort((a, b) => a - b)

  const guestCount = getGuestCount(data)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-5 py-3 text-base font-semibold text-foreground">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="h-4 w-4" aria-hidden="true" />
        </span>
        <StableText {...tBoth((tr) => tr.email.badge)} />
      </div>

      <p className="text-center text-sm uppercase tracking-[0.2em] text-muted-foreground">
        <StableText {...tBoth((tr) => tr.email.preview)} />
      </p>

      <div className="overflow-hidden rounded-3xl border border-border bg-background shadow-xl">
        <div className="flex items-center gap-3 border-b border-border bg-card px-5 py-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Mail className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-foreground">
              <StableText {...tBoth((tr) => tr.email.from)} />
            </p>
            <p className="truncate text-sm text-muted-foreground">
              {data.email}
            </p>
          </div>
        </div>

        <div className="space-y-5 px-5 py-6 md:px-8">
          <p className="font-script text-3xl text-primary">
            <StableText block {...tBoth((tr) => tr.email.subject)} />
          </p>

          <p className="text-lg text-foreground">
            <StableText {...tBoth((tr) => tr.email.greeting)} /> {data.firstName}{" "}
            {data.lastName},
          </p>
          <p className="text-base leading-relaxed text-muted-foreground">
            <StableText block {...tBoth((tr) => tr.email.body1)} />
          </p>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="mb-3 text-base font-semibold text-foreground">
              <StableText {...tBoth((tr) => tr.email.detailsTitle)} />
            </p>
            <dl className="space-y-3 text-base">
              <Detail label={tBoth((tr) => tr.email.events)}>
                <ul className="space-y-0.5">
                  {eventIndices.map((i) => (
                    <li key={i} className="text-foreground">
                      <StableText
                        {...tBoth(
                          (tr) =>
                            `${tr.timeline.events[i].time} · ${tr.timeline.events[i].title}`,
                        )}
                      />
                    </li>
                  ))}
                </ul>
              </Detail>
              <Detail label={tBoth((tr) => tr.email.guests)}>
                {guestCount}{" "}
                <StableText
                  {...tBoth((tr) =>
                    guestCount === 1 ? tr.common.person : tr.common.people,
                  )}
                />
              </Detail>
              {data.plusOne && (
                <Detail label={tBoth((tr) => tr.email.plusOne)}>
                  <StableText {...tBoth((tr) => tr.rsvp.yes)} />
                  {data.plusOneName.trim() ? ` · ${data.plusOneName}` : ""}
                </Detail>
              )}
              {data.withKids && (
                <Detail label={tBoth((tr) => tr.email.kids)}>
                  {data.kidsCount}{" "}
                  <StableText
                    {...tBoth((tr) =>
                      data.kidsCount === 1 ? tr.common.kid : tr.common.kids,
                    )}
                  />
                </Detail>
              )}
              <Detail label={tBoth((tr) => tr.email.diet)}>
                {dietLabelsRo.length > 0 ? (
                  <StableText
                    ro={dietLabelsRo.join(", ")}
                    en={dietLabelsEn.join(", ")}
                  />
                ) : (
                  <StableText {...tBoth((tr) => tr.email.noDiet)} />
                )}
              </Detail>
            </dl>
          </div>

          <p className="text-base leading-relaxed text-muted-foreground">
            <StableText block {...tBoth((tr) => tr.email.body2)} />
          </p>

          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
            <p className="font-script text-2xl text-primary">
              <StableText block {...tBoth((tr) => tr.hero.names)} />
            </p>
            <p className="text-sm text-muted-foreground">
              <StableText {...tBoth((tr) => tr.hero.date)} />
            </p>
            <ul className="mt-3 space-y-1 text-sm text-foreground">
              {eventIndices.map((i) => (
                <li key={i}>
                  <StableText
                    {...tBoth(
                      (tr) =>
                        `${tr.timeline.events[i].time} — ${tr.timeline.events[i].title}, ${tr.timeline.events[i].place}`,
                    )}
                  />
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-1">
            <p className="text-base text-muted-foreground">
              <StableText {...tBoth((tr) => tr.email.signature)} />
            </p>
            <p className="font-script text-3xl text-foreground">
              <StableText block {...tBoth((tr) => tr.email.names)} />
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button
          variant="outline"
          size="lg"
          onClick={onReset}
          className="rounded-full border-primary/40 bg-transparent text-base font-semibold text-foreground hover:bg-primary/10"
        >
          <StableText {...tBoth((tr) => tr.email.again)} />
        </Button>
        <Button
          size="lg"
          onClick={() => window.print()}
          className="rounded-full text-base font-semibold"
        >
          <StableText {...tBoth((tr) => tr.email.print)} />
        </Button>
      </div>
    </div>
  )
}

function Detail({
  label,
  children,
}: {
  label: { ro: string; en: string }
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-border/60 pb-3 last:border-0 last:pb-0 sm:flex-row sm:gap-4">
      <dt className="font-medium text-muted-foreground sm:w-40 sm:shrink-0">
        <StableText {...label} />
      </dt>
      <dd className="text-foreground">{children}</dd>
    </div>
  )
}
