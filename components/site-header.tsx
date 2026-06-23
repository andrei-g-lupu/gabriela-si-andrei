"use client"

import Link from "next/link"
import { LanguageSwitch } from "@/components/language-switch"
import { StableText } from "@/components/stable-text"
import { Button } from "@/components/ui/button"
import { tBoth } from "@/lib/i18n"

const navLinks = [
  { href: "/#home", label: tBoth((t) => t.nav.home) },
  { href: "/#story", label: tBoth((t) => t.nav.story) },
  { href: "/#timeline", label: tBoth((t) => t.nav.timeline) },
] as const

export function SiteHeader() {

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Link
          href="/#home"
          className="font-script text-2xl leading-none text-foreground md:text-3xl"
        >
          G & A
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-base font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              <StableText {...link.label} />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <LanguageSwitch />
          <Button
            asChild
            className="rounded-full px-4 text-base font-semibold md:px-6"
          >
            <Link href="/rsvp">
              <StableText {...tBoth((t) => t.nav.register)} />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
