"use client"

import Image from "next/image"
import { StableText } from "@/components/stable-text"
import { tBoth } from "@/lib/i18n"

export function Story() {
  return (
    <section id="story" className="scroll-mt-20 overflow-x-clip bg-card/50">
      <div className="mx-auto grid max-w-5xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-8 md:py-24">
        <div className="relative mx-auto w-full max-w-sm">
          <Image
            src="/images/floral-line-art.png"
            alt=""
            aria-hidden="true"
            width={200}
            height={200}
            className="pointer-events-none absolute -right-8 -top-8 w-28 opacity-50 md:w-36"
          />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border-4 border-card shadow-xl">
            <Image
              src="/images/gabriela-si-andrei-new-new.jpg"
              alt="Gabriela și Andrei"
              fill
              sizes="(max-width: 768px) 100vw, 24rem"
              className="object-cover"
            />
          </div>
        </div>

        <div className="text-center md:text-left">
          <p className="text-base uppercase tracking-[0.3em] text-primary">
            <StableText {...tBoth((t) => t.hero.kicker)} />
          </p>
          <h2 className="mt-2 font-script text-5xl text-foreground md:text-6xl">
            <StableText block {...tBoth((t) => t.nav.story)} />
          </h2>
          <p className="mt-5 text-xl leading-relaxed text-muted-foreground">
            <StableText block {...tBoth((t) => t.hero.intro)} />
          </p>
          <p className="mt-6 font-script text-4xl text-primary">
            <StableText block {...tBoth((t) => t.hero.names)} />
          </p>
        </div>
      </div>
    </section>
  )
}
