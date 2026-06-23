"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { translations, type Lang, type Translation } from "@/lib/i18n"

type LanguageContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  toggle: () => void
  t: Translation
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("ro")

  useEffect(() => {
    const stored = window.localStorage.getItem("wedding-lang")
    if (stored === "ro" || stored === "en") {
      setLang(stored)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem("wedding-lang", lang)
    document.documentElement.lang = lang
  }, [lang])

  const toggle = () => setLang((prev) => (prev === "ro" ? "en" : "ro"))

  return (
    <LanguageContext.Provider
      value={{ lang, setLang, toggle, t: translations[lang] as Translation }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return ctx
}
