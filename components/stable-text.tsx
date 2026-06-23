"use client"

import { useLanguage } from "@/components/language-provider"
import { cn } from "@/lib/utils"

type StableTextProps = {
  ro: string
  en: string
  className?: string
  block?: boolean
}

export function StableText({ ro, en, className, block }: StableTextProps) {
  const { lang } = useLanguage()

  return (
    <span
      className={cn(block ? "grid w-full" : "inline-grid", className)}
      aria-live="polite"
    >
      <span
        className={cn(
          "col-start-1 row-start-1",
          lang !== "ro" && "invisible",
        )}
        aria-hidden={lang !== "ro"}
      >
        {ro}
      </span>
      <span
        className={cn(
          "col-start-1 row-start-1",
          lang !== "en" && "invisible",
        )}
        aria-hidden={lang !== "en"}
      >
        {en}
      </span>
    </span>
  )
}
