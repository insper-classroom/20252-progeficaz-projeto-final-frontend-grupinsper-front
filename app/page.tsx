"use client"

import { LandingHeader } from "@/components/landing/landing-header"
import { HeroSection } from "@/components/landing/hero-section"
import { ProblemSection } from "@/components/landing/problem-section"
import { SolutionSection } from "@/components/landing/solution-section"
import { StatsSection } from "@/components/landing/stats-section"
import { CtaSection } from "@/components/landing/cta-section"
import { useEffect, useState } from "react"

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show fade effect after scrolling past the hero section (approximately)
      setScrolled(window.scrollY > window.innerHeight * 0.8)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-background relative">
      <div
        className={`fixed top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent z-40 pointer-events-none transition-opacity duration-300 ${
          scrolled ? "opacity-100" : "opacity-0"
        }`}
      />
      <LandingHeader />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <StatsSection />
      <CtaSection />
    </div>
  )
}
