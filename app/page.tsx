import { Countdown } from "@/components/countdown"
import { Hero } from "@/components/hero"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Story } from "@/components/story"
import { Timeline } from "@/components/timeline"

export default function Page() {
  return (
    <main className="min-h-dvh">
      <SiteHeader />
      <Hero />
      <Countdown />
      <Story />
      <Timeline />
      <SiteFooter />
    </main>
  )
}
