"use client"

import { Minus, Plus } from "lucide-react"
import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import { StableText } from "@/components/stable-text"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { tBoth } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export type RsvpData = {
  firstName: string
  lastName: string
  email: string
  events: string[]
  plusOne: boolean
  plusOneName: string
  withKids: boolean
  kidsCount: number
  diet: string[]
  dietOther: string
}

const EVENT_KEYS = ["1", "2"] as const
const DIET_KEYS = [
  "none",
  "noMeat",
  "noPork",
  "noFish",
  "vegetarian",
  "vegan",
  "glutenFree",
  "lactoseFree",
  "other",
] as const

type FormError =
  | "required"
  | "selectEvent"
  | "alreadySubmitted"
  | "submitFailed"
  | null

function choiceClasses(selected: boolean, shape: "card" | "pill") {
  return cn(
    "cursor-pointer border-2 transition-colors",
    shape === "card" ? "rounded-2xl" : "rounded-full",
    selected
      ? "border-primary bg-primary/25 font-semibold text-primary ring-2 ring-primary/40"
      : "border-border bg-background font-semibold text-muted-foreground ring-2 ring-transparent hover:border-primary/60 hover:bg-primary/10",
  )
}

export function RsvpForm({ onSubmit }: { onSubmit: (data: RsvpData) => void }) {
  const { t, lang } = useLanguage()
  const [error, setError] = useState<FormError>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formStartedAt] = useState(() => Date.now())

  const [form, setForm] = useState<RsvpData>({
    firstName: "",
    lastName: "",
    email: "",
    events: [],
    plusOne: false,
    plusOneName: "",
    withKids: false,
    kidsCount: 1,
    diet: [],
    dietOther: "",
  })

  const toggleEvent = (key: string) => {
    setForm((f) => ({
      ...f,
      events: f.events.includes(key)
        ? f.events.filter((e) => e !== key)
        : [...f.events, key],
    }))
  }

  const toggleDiet = (key: string) => {
    setForm((f) => {
      if (key === "none") {
        return { ...f, diet: f.diet.includes("none") ? [] : ["none"] }
      }
      const without = f.diet.filter((d) => d !== "none")
      return {
        ...f,
        diet: without.includes(key)
          ? without.filter((d) => d !== key)
          : [...without, key],
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      setError("required")
      return
    }
    if (form.events.length === 0) {
      setError("selectEvent")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          lang,
          website: "",
          formStartedAt,
        }),
      })

      if (!res.ok) {
        if (res.status === 409) {
          setError("alreadySubmitted")
          return
        }

        setError("submitFailed")
        return
      }

      onSubmit(form)
    } catch {
      setError("submitFailed")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-base">
            <StableText {...tBoth((t) => t.rsvp.firstName)} /> *
          </Label>
          <Input
            id="firstName"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            className="h-12 rounded-full bg-background px-5 text-base"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-base">
            <StableText {...tBoth((t) => t.rsvp.lastName)} /> *
          </Label>
          <Input
            id="lastName"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            className="h-12 rounded-full bg-background px-5 text-base"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-base">
          <StableText {...tBoth((t) => t.rsvp.email)} /> *
        </Label>
        <Input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="h-12 rounded-full bg-background px-5 text-base"
          required
        />
      </div>

      <fieldset className="space-y-3">
        <legend className="text-lg font-semibold text-foreground">
          <StableText {...tBoth((t) => t.rsvp.attendingTitle)} /> *
        </legend>
        <p className="text-sm text-muted-foreground">
          <StableText block {...tBoth((t) => t.rsvp.attendingHint)} />
        </p>
        <div className="grid gap-3">
          {EVENT_KEYS.map((key) => {
            const checked = form.events.includes(key)
            const index = Number(key) - 1
            return (
              <label
                key={key}
                className={cn(
                  "flex items-start gap-3 p-4",
                  choiceClasses(checked, "card"),
                )}
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => toggleEvent(key)}
                  className="mt-1"
                />
                <span>
                  <span
                    className={cn(
                      "block text-base font-semibold",
                      checked ? "text-primary" : "text-foreground",
                    )}
                  >
                    <StableText
                      {...tBoth(
                        (tr) =>
                          `${tr.timeline.events[index].time} · ${tr.timeline.events[index].title}`,
                      )}
                    />
                  </span>
                  <span className="block text-sm text-muted-foreground">
                    <StableText
                      block
                      {...tBoth((tr) => tr.timeline.events[index].place)}
                    />
                  </span>
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-lg font-semibold text-foreground">
          <StableText {...tBoth((t) => t.rsvp.plusOneTitle)} />
        </legend>
        <YesNo
          value={form.plusOne}
          onChange={(v) => setForm({ ...form, plusOne: v })}
          name="plusOne"
        />
        {form.plusOne && (
          <div className="space-y-2 pt-1">
            <Label htmlFor="plusOneName" className="text-base">
              <StableText {...tBoth((t) => t.rsvp.plusOneName)} />
            </Label>
            <Input
              id="plusOneName"
              value={form.plusOneName}
              onChange={(e) =>
                setForm({ ...form, plusOneName: e.target.value })
              }
              className="h-12 rounded-full bg-background px-5 text-base"
            />
          </div>
        )}
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-lg font-semibold text-foreground">
          <StableText {...tBoth((t) => t.rsvp.kidsTitle)} />
        </legend>
        <YesNo
          value={form.withKids}
          onChange={(v) => setForm({ ...form, withKids: v })}
          name="withKids"
        />
        {form.withKids && (
          <div className="space-y-2 pt-1">
            <Label id="kidsCount-label" className="text-base">
              <StableText {...tBoth((t) => t.rsvp.kidsCount)} />
            </Label>
            <div
              className="flex w-fit items-center gap-2"
              role="group"
              aria-labelledby="kidsCount-label"
            >
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-12 shrink-0 rounded-full border-border"
                disabled={form.kidsCount <= 1}
                onClick={() =>
                  setForm({
                    ...form,
                    kidsCount: Math.max(1, form.kidsCount - 1),
                  })
                }
                aria-label={t.rsvp.kidsDecrease}
              >
                <Minus className="h-5 w-5" aria-hidden="true" />
              </Button>
              <div
                id="kidsCount"
                className="flex h-12 min-w-12 items-center justify-center rounded-full border-2 border-border bg-background px-4 text-base font-semibold tabular-nums text-foreground"
                aria-live="polite"
              >
                {form.kidsCount}
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-12 shrink-0 rounded-full border-border"
                disabled={form.kidsCount >= 10}
                onClick={() =>
                  setForm({
                    ...form,
                    kidsCount: Math.min(10, form.kidsCount + 1),
                  })
                }
                aria-label={t.rsvp.kidsIncrease}
              >
                <Plus className="h-5 w-5" aria-hidden="true" />
              </Button>
            </div>
          </div>
        )}
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-lg font-semibold text-foreground">
          <StableText {...tBoth((t) => t.rsvp.dietTitle)} />
        </legend>
        <p className="text-sm text-muted-foreground">
          <StableText block {...tBoth((t) => t.rsvp.dietHint)} />
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {DIET_KEYS.map((key) => {
            const checked = form.diet.includes(key)
            return (
              <label
                key={key}
                className={cn(
                  "flex items-center gap-3 px-4 py-3",
                  choiceClasses(checked, "pill"),
                )}
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => toggleDiet(key)}
                />
                <span
                  className={cn(
                    "text-base font-semibold",
                    checked ? "text-primary" : "text-foreground",
                  )}
                >
                  <StableText {...tBoth((tr) => tr.rsvp.dietOptions[key])} />
                </span>
              </label>
            )
          })}
        </div>
        {form.diet.includes("other") && (
          <Input
            value={form.dietOther}
            onChange={(e) => setForm({ ...form, dietOther: e.target.value })}
            placeholder={t.rsvp.dietOtherPlaceholder}
            className="h-12 rounded-full bg-background px-5 text-base"
          />
        )}
      </fieldset>

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-base text-destructive"
        >
          {error === "required" ? (
            <StableText block {...tBoth((tr) => tr.rsvp.required)} />
          ) : error === "selectEvent" ? (
            <StableText block {...tBoth((tr) => tr.rsvp.selectEvent)} />
          ) : error === "alreadySubmitted" ? (
            <StableText block {...tBoth((tr) => tr.rsvp.alreadySubmitted)} />
          ) : (
            <StableText block {...tBoth((tr) => tr.rsvp.submitFailed)} />
          )}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={submitting}
        className="w-full rounded-full text-lg font-semibold"
      >
        <StableText
          {...tBoth((tr) =>
            submitting ? tr.rsvp.submitting : tr.rsvp.submit,
          )}
        />
      </Button>
    </form>
  )
}

function YesNo({
  value,
  onChange,
  name,
}: {
  value: boolean
  onChange: (v: boolean) => void
  name: string
}) {
  return (
    <RadioGroup
      value={value ? "yes" : "no"}
      onValueChange={(v) => onChange(v === "yes")}
      className="flex gap-3"
    >
      {[
        { id: `${name}-yes`, val: "yes", label: tBoth((t) => t.rsvp.yes) },
        { id: `${name}-no`, val: "no", label: tBoth((t) => t.rsvp.no) },
      ].map((opt) => {
        const selected = (opt.val === "yes") === value
        return (
        <Label
          key={opt.id}
          htmlFor={opt.id}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 px-4 py-3 text-base",
            choiceClasses(selected, "pill"),
          )}
        >
          <RadioGroupItem id={opt.id} value={opt.val} className="sr-only" />
          <StableText {...opt.label} />
        </Label>
        )
      })}
    </RadioGroup>
  )
}

