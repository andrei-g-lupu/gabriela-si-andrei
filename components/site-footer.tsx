"use client"

import { StableText } from "@/components/stable-text"
import { tBoth } from "@/lib/i18n"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/50">
      <div className="mx-auto max-w-4xl px-4 py-10 text-center md:px-8">
        <p className="font-script text-4xl text-foreground">
          <StableText block {...tBoth((t) => t.hero.names)} />
        </p>
        <p className="mt-2 text-lg text-primary">
          <StableText {...tBoth((t) => t.hero.date)} />
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          <StableText block {...tBoth((t) => t.footer.madeWith)} />
        </p>
      </div>
    </footer>
  )
}
