"use client"

import Image from "next/image"
import Link from "next/link"
import { StableText } from "@/components/stable-text"
import { Button } from "@/components/ui/button"
import { tBoth } from "@/lib/i18n"

export function Hero() {
  return (
    <section id="home" className="relative overflow-x-clip">
      {/* decorative florals */}
      <Image
        src="/images/floral-line-art.png"
        alt=""
        aria-hidden="true"
        width={420}
        height={420}
        className="pointer-events-none absolute -left-24 bottom-0 w-64 opacity-50 md:w-96"
      />
      <Image
        src="/images/floral-line-art.png"
        alt=""
        aria-hidden="true"
        width={420}
        height={420}
        className="pointer-events-none absolute -right-20 -top-10 w-56 -scale-x-100 opacity-40 md:w-80"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:gap-8 md:px-8 md:py-20">
        {/* Text */}
        <div className="order-2 text-center md:order-1 md:text-left">
          <p className="mb-3 text-lg uppercase tracking-[0.3em] text-primary">
            <StableText {...tBoth((t) => t.hero.kicker)} />
          </p>
          <h1 className="font-script text-6xl leading-[0.95] text-foreground text-balance md:text-7xl lg:text-8xl">
            <StableText block {...tBoth((t) => t.hero.names)} />
          </h1>
          <p className="mt-5 text-2xl text-foreground/80 md:text-3xl">
            <StableText block {...tBoth((t) => t.hero.subtitle)} />
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xl font-semibold text-foreground md:justify-start">
            <StableText {...tBoth((t) => t.hero.date)} />
            <span aria-hidden="true" className="text-primary">
              •
            </span>
            <StableText {...tBoth((t) => t.hero.city)} />
          </div>

          <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-muted-foreground md:mx-0">
            <StableText block {...tBoth((t) => t.hero.intro)} />
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row md:justify-start">
            <Button
              asChild
              size="lg"
              className="rounded-full px-8 text-lg font-semibold"
            >
              <Link href="/rsvp">
                <StableText {...tBoth((t) => t.hero.cta)} />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border-primary/40 bg-transparent px-8 text-lg font-semibold text-foreground hover:bg-primary/10"
            >
              <Link href="/#timeline">
                <StableText {...tBoth((t) => t.hero.scroll)} />
              </Link>
            </Button>
          </div>
        </div>

        {/* Photo */}
        <div className="order-1 flex justify-center md:order-2">
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-secondary/60 blur-xl" />
            <div className="relative aspect-square w-72 overflow-hidden rounded-full border-4 border-card shadow-2xl sm:w-80 md:w-[26rem]">
              <Image
                src="/images/andrei-gabriela-new.jpg"
                alt="Gabriela și Andrei"
                fill
                priority
                sizes="(max-width: 768px) 20rem, 26rem"
                className="object-cover object-[25%_center]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

