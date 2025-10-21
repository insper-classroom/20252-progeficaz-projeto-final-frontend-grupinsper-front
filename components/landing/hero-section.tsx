import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { AnimatedMouse } from "./animated-mouse"

export function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-20">
      <div className="max-w-5xl mx-auto text-center space-y-8">
        <h1 className="text-6xl md:text-7xl font-bold text-foreground text-balance">Gestão simplificada.</h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Uma única plataforma para todas as suas faturas
        </p>

        <div className="flex flex-col items-center gap-4">
          <Link href="/login">
            <Button
              size="lg"
              className="bg-[hsl(189,94%,63%)] hover:bg-[hsl(189,94%,58%)] text-black font-semibold px-8 py-6 text-lg h-auto transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[hsl(189,94%,63%)]/30"
            >
              Começar gratuitamente
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>

        <div className="pt-20 flex flex-col items-center gap-4">
          <p className="text-sm text-muted-foreground">Role para descobrir mais</p>
          <AnimatedMouse />
        </div>
      </div>
    </section>
  )
}
