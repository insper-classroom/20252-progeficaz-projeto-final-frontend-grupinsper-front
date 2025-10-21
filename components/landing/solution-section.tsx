import { Zap, BarChart3, CheckCircle2 } from "lucide-react"

const solutions = [
  {
    icon: Zap,
    title: "Consolidação Inteligente",
    description: "Una todas as suas faturas em uma única estrutura organizada e acessível",
    features: ["Upload automático", "Categorização IA", "Busca instantânea"],
  },
  {
    icon: BarChart3,
    title: "Análise Avançada",
    description: "Dashboards intuitivos com insights acionáveis para seu negócio",
    features: ["Gráficos em tempo real", "Relatórios customizados", "Previsões precisas"],
  },
]

export function SolutionSection() {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-accent/5" />
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-600/20 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-950/50 border border-rose-900/50">
            <div className="w-2 h-2 rounded-full bg-[hsl(189,94%,63%)]" />
            <span className="text-sm text-rose-200">A solução</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-foreground text-balance">
            Centralize. Automatize. Prospere.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {solutions.map((solution, index) => {
            const Icon = solution.icon
            return (
              <div
                key={index}
                className="p-8 rounded-2xl bg-card border border-[hsl(189,94%,63%)]/30 space-y-6 transition-all duration-300 hover:scale-[1.02] hover:border-[hsl(189,94%,63%)]/60 hover:shadow-lg hover:shadow-[hsl(189,94%,63%)]/20"
              >
                <div className="w-14 h-14 rounded-xl bg-[hsl(340,30%,40%)] flex items-center justify-center">
                  <Icon className="w-7 h-7 text-rose-100" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-semibold text-foreground">{solution.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{solution.description}</p>
                </div>
                <ul className="space-y-3">
                  {solution.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-foreground">
                      <CheckCircle2 className="w-5 h-5 text-[hsl(189,94%,63%)]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
