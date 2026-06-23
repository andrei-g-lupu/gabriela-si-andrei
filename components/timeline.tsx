"use client"

import { MapPin } from "lucide-react"
import Link from "next/link"
import { StableText } from "@/components/stable-text"
import { Button } from "@/components/ui/button"
import { tBoth } from "@/lib/i18n"

export function Timeline() {
  return (
    <section id="timeline" className="scroll-mt-20">
      <div className="mx-auto max-w-4xl px-4 py-16 md:px-8 md:py-24">
        <div className="text-center">
          <p className="text-base uppercase tracking-[0.3em] text-primary">
            <StableText {...tBoth((t) => t.timeline.subtitle)} />
          </p>
          <h2 className="mt-2 font-script text-5xl text-foreground md:text-6xl">
            <StableText block {...tBoth((t) => t.timeline.title)} />
          </h2>
        </div>

        <ol className="relative mt-12 border-l-2 border-primary/30 pl-6 md:mx-auto md:max-w-2xl md:pl-10">
          {[0, 1].map((i) => (
            <li key={i} className="relative mb-10 last:mb-0">
              <span
                aria-hidden="true"
                className="absolute -left-[1.95rem] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary bg-background md:-left-[3.2rem]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm md:p-6">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-2xl font-bold text-primary tabular-nums">
                    <StableText
                      {...tBoth((t) => t.timeline.events[i].time)}
                    />
                  </span>
                  <h3 className="text-2xl font-semibold text-foreground">
                    <StableText
                      {...tBoth((t) => t.timeline.events[i].title)}
                    />
                  </h3>
                </div>
                <p className="mt-1 text-lg font-medium text-foreground/90">
                  <StableText
                    block
                    {...tBoth((t) => t.timeline.events[i].place)}
                  />
                </p>
                <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                  <StableText
                    block
                    {...tBoth((t) => t.timeline.events[i].desc)}
                  />
                </p>
                <a
                  href={tBoth((t) => t.timeline.events[i].map).ro}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-base font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <StableText {...tBoth((t) => t.timeline.mapLabel)} />
                </a>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-12 text-center">
          <Button
            asChild
            size="lg"
            className="rounded-full px-8 text-lg font-semibold"
          >
            <Link href="/rsvp">
              <StableText {...tBoth((t) => t.nav.register)} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
