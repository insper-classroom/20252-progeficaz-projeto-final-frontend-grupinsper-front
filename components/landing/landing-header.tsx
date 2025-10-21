import Link from "next/link"
import { Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LandingHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold text-foreground">InvoiceFlow</span>
        </Link>

        <Link href="/login">
          <Button
            variant="ghost"
            className="text-foreground hover:text-foreground hover:bg-[hsl(189,94%,63%)]/10 transition-all duration-300"
          >
            Entrar
          </Button>
        </Link>
      </div>
    </header>
  )
}
