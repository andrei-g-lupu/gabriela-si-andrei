"use client"

import { useEffect, useState } from "react"
import { StableText } from "@/components/stable-text"
import { tBoth } from "@/lib/i18n"

const TARGET = new Date("2026-09-26T17:45:00+03:00").getTime()

const COUNTDOWN_UNITS = [
  {
    label: tBoth((t) => t.countdown.days),
    getValue: (time: ReturnType<typeof getRemaining>) => time.days,
  },
  {
    label: tBoth((t) => t.countdown.hours),
    getValue: (time: ReturnType<typeof getRemaining>) => time.hours,
  },
  {
    label: tBoth((t) => t.countdown.minutes),
    getValue: (time: ReturnType<typeof getRemaining>) => time.minutes,
  },
  {
    label: tBoth((t) => t.countdown.seconds),
    getValue: (time: ReturnType<typeof getRemaining>) => time.seconds,
  },
] as const

function getRemaining() {
  const diff = Math.max(0, TARGET - Date.now())
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export function Countdown() {
  const [time, setTime] = useState(getRemaining)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const id = setInterval(() => setTime(getRemaining()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="border-y border-border/60 bg-card/50">
      <div className="mx-auto max-w-4xl px-4 py-10 text-center md:px-8">
        <p className="mb-6 font-script text-3xl text-primary md:text-4xl">
          <StableText block {...tBoth((t) => t.countdown.title)} />
        </p>
        <div className="grid grid-cols-4 gap-3 md:gap-6">
          {COUNTDOWN_UNITS.map((unit, index) => (
            <div
              key={index}
              className="rounded-2xl border border-border/60 bg-background/70 px-2 py-4 md:py-6"
            >
              <div className="text-3xl font-bold tabular-nums text-foreground md:text-5xl">
                {mounted
                  ? String(unit.getValue(time)).padStart(2, "0")
                  : "--"}
              </div>
              <div className="mt-1 text-sm uppercase tracking-wide text-muted-foreground md:text-base">
                <StableText {...unit.label} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
