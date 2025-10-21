import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CtaSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="p-12 rounded-3xl border border-[hsl(189,94%,63%)]/20 bg-card text-center space-y-8 transition-all duration-300 hover:border-[hsl(189,94%,63%)]/40 hover:shadow-xl hover:shadow-[hsl(189,94%,63%)]/10">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground text-balance">Pronto para simplificar?</h2>

          <p className="text-xl text-muted-foreground">
            Junte-se a centenas de empresas que já transformaram sua gestão financeira
          </p>

          <div className="flex flex-col items-center gap-4">
            <Link href="login">
              <Button
                size="lg"
                className="bg-[hsl(189,94%,63%)] hover:bg-[hsl(189,94%,58%)] text-black font-semibold px-8 py-6 text-lg h-auto transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[hsl(189,94%,63%)]/30"
              >
                Começar gratuitamente
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>

            <p className="text-sm text-muted-foreground">Sem cartão de crédito • Teste por 14 dias</p>
          </div>
        </div>
      </div>
    </section>
  )
}
