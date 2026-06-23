"use client"

import { useLanguage } from "@/components/language-provider"
import { cn } from "@/lib/utils"

export function LanguageSwitch({ className }: { className?: string }) {
  const { lang, setLang } = useLanguage()

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-card/70 p-1 backdrop-blur",
        className,
      )}
      role="group"
      aria-label="Language"
    >
      {(["ro", "en"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={cn(
            "min-w-10 rounded-full px-3 py-1 text-sm font-semibold uppercase tracking-wide transition-colors",
            lang === code
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {code}
        </button>
      ))}
    </div>
  )
}
