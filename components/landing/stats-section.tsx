const stats = [
  {
    value: "500+",
    label: "Empresas ativas",
  },
  {
    value: "10k+",
    label: "Faturas processadas/mês",
  },
  {
    value: "98%",
    label: "Satisfação dos clientes",
  },
]

export function StatsSection() {
  return (
    <section className="py-24 px-6 bg-accent/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">Empresas que confiam</h2>
          <p className="text-xl text-muted-foreground">Mais de 500 empresas já simplificaram sua gestão</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center space-y-2">
              <div className="text-5xl md:text-6xl font-bold text-foreground">{stat.value}</div>
              <div className="text-lg text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
