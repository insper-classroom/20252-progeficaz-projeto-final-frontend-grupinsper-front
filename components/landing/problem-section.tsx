import { FileText, TrendingUp, BarChart3 } from "lucide-react"

const problems = [
  {
    icon: FileText,
    title: "Dispersão",
    description: "Documentos espalhados em múltiplos sistemas, e-mails e arquivos físicos",
  },
  {
    icon: TrendingUp,
    title: "Complexidade",
    description: "Processos manuais que consomem horas valiosas do seu time",
  },
  {
    icon: BarChart3,
    title: "Falta de Insights",
    description: "Dificuldade em analisar tendências e tomar decisões baseadas em dados",
  },
]

export function ProblemSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-950/50 border border-rose-900/50">
            <div className="w-2 h-2 rounded-full bg-rose-500" />
            <span className="text-sm text-rose-200">O problema</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-foreground text-balance">
            Faturas desorganizadas custam tempo e dinheiro
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((problem, index) => {
            const Icon = problem.icon
            return (
              <div
                key={index}
                className="p-8 rounded-2xl bg-card border border-border space-y-4 transition-all duration-300 hover:scale-105 hover:border-rose-500/50 hover:shadow-lg hover:shadow-rose-500/10"
              >
                <div className="w-14 h-14 rounded-xl bg-[hsl(340,30%,40%)] flex items-center justify-center">
                  <Icon className="w-7 h-7 text-rose-100" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground">{problem.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{problem.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
