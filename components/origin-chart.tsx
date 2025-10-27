// Em components/origin-chart.tsx
"use client"

import { useMemo } from "react"
import { PieChart, Pie, ResponsiveContainer, Cell } from "recharts"

// --- Definir os tipos de dados ---
type Transferencia = {
  valor: number
  data: string
  origem: string
  categoria: string
}
type ExtratoItem = {
  banco: string
  _id: string
  transferencias: Transferencia[]
}
type Fatura = {
  _id: string
  extratos?: ExtratoItem[][]
}
// --- Fim dos Tipos ---

// ***** INÍCIO DA CORREÇÃO *****
// Cores (Paleta Secundária - "Rotacionada")
// Começa com chart-3 para ser diferente do gráfico de Categoria
const COLORS = [
  "var(--chart-3)", // Laranja/Amarelo (cor principal)
  "var(--chart-4)", // Verde
  "var(--chart-5)", // Roxo/Rosa
  "var(--chart-1)", // Ciano (cor secundária)
  "var(--chart-2)", // Roxo (cor secundária)
]
// ***** FIM DA CORREÇÃO *****

export function OriginChart({ data: faturas }: { data: Fatura[] }) {
  
  const processedData = useMemo(() => {
    if (!faturas || faturas.length === 0) {
      return []
    }
    
    const originMap = new Map<string, number>()

    faturas.forEach((f) => {
      const todosExtratos = f.extratos?.flat(2) ?? []
      todosExtratos.forEach((extrato) => {
        extrato?.transferencias?.forEach((t) => {
          if (t && t.valor > 0) {
            const origin = t.origem || "Outra Origem" 
            const currentTotal = originMap.get(origin) || 0
            originMap.set(origin, currentTotal + t.valor)
          }
        })
      })
    })

    const totalValue = Array.from(originMap.values()).reduce((a, b) => a + b, 0)

    return Array.from(originMap.entries()).map(
      ([name, value], index) => ({
        name,
        value,
        color: COLORS[index % COLORS.length], // <-- Usa o novo array de cores
        percentage: totalValue === 0 ? 0 : Math.round((value / totalValue) * 100),
      }),
    )
  }, [faturas])

  // ... (O resto do seu JSX é o mesmo) ...
  return (
    <div className="space-y-6">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={processedData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {processedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke={entry.color}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-3 p-4">
        {processedData.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center">
            Sem dados de origem para exibir.
          </p>
        ) : (
          processedData.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-muted-foreground">{item.name}</span>
              </div>
              <span className="font-medium text-foreground">
                {item.percentage}%
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}