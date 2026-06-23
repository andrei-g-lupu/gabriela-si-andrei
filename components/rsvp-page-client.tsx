"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { EmailConfirmation } from "@/components/email-confirmation"
import { LanguageSwitch } from "@/components/language-switch"
import { RsvpForm, type RsvpData } from "@/components/rsvp-form"
import { StableText } from "@/components/stable-text"
import { tBoth } from "@/lib/i18n"

export function RsvpPageClient() {
  const [submitted, setSubmitted] = useState<RsvpData | null>(null)

  return (
    <main className="relative min-h-dvh overflow-x-clip">
      <Image
        src="/images/floral-line-art.png"
        alt=""
        aria-hidden="true"
        width={420}
        height={420}
        className="pointer-events-none absolute -right-24 top-24 w-64 opacity-30 md:w-80"
      />
      <Image
        src="/images/floral-line-art.png"
        alt=""
        aria-hidden="true"
        width={420}
        height={420}
        className="pointer-events-none absolute -left-24 bottom-0 w-56 -scale-x-100 opacity-30 md:w-72"
      />

      {/* top bar */}
      <div className="relative mx-auto flex max-w-3xl items-center justify-between px-4 py-5 md:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-base font-medium text-foreground/80 transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-5 w-5 shrink-0" aria-hidden="true" />
          <StableText {...tBoth((t) => t.nav.home)} />
        </Link>
        <LanguageSwitch />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 pb-20 md:px-8">
        {/* heading */}
        <div className="mb-8 text-center">
          <p className="font-script text-4xl text-primary md:text-5xl">
            <StableText block {...tBoth((t) => t.hero.names)} />
          </p>
          <h1 className="mt-3 font-script text-5xl text-foreground md:text-6xl">
            {submitted ? (
              <StableText block {...tBoth((t) => t.email.subject)} />
            ) : (
              <StableText block {...tBoth((t) => t.rsvp.title)} />
            )}
          </h1>
          {!submitted && (
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
              <StableText block {...tBoth((t) => t.rsvp.subtitle)} />
            </p>
          )}
        </div>

        <div className="rounded-[2rem] border border-border/60 bg-card p-6 shadow-lg md:p-10">
          {submitted ? (
            <EmailConfirmation
              data={submitted}
              onReset={() => setSubmitted(null)}
            />
          ) : (
            <RsvpForm onSubmit={setSubmitted} />
          )}
        </div>
      </div>
    </main>
  )
}
