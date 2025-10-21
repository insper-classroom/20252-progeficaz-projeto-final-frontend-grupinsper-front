import { Zap, Shield, CheckCircle2 } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Automação Total",
    description: "Elimine tarefas repetitivas e foque no crescimento do seu negócio",
    items: ["Lembretes automáticos", "Integração bancária", "Workflow personalizado"],
  },
  {
    icon: Shield,
    title: "Segurança Máxima",
    description: "Seus dados protegidos com criptografia de nível bancário",
    items: ["Criptografia E2E", "Backup automático", "Conformidade LGPD"],
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="p-8 rounded-2xl bg-card border border-[hsl(189,94%,63%)]/30 space-y-6 transition-all duration-300 hover:scale-[1.02] hover:border-[hsl(189,94%,63%)]/60 hover:shadow-lg hover:shadow-[hsl(189,94%,63%)]/20"
              >
                <div className="w-14 h-14 rounded-xl bg-[hsl(340,30%,40%)] flex items-center justify-center">
                  <Icon className="w-7 h-7 text-rose-100" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
                <ul className="space-y-3">
                  {feature.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-foreground">
                      <CheckCircle2 className="w-5 h-5 text-[hsl(189,94%,63%)]" />
                      <span>{item}</span>
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
