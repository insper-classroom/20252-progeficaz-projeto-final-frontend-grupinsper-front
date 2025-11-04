"use client"

import { useMemo } from "react" // Mantém apenas useMemo
import { PieChart, Pie, ResponsiveContainer, Cell } from "recharts"

// --- 2. Definir os tipos de dados (copie do seu dashboard-content.tsx) ---
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
  // ... outros campos que você possa ter
}
// --- Fim dos Tipos ---

// 3. Definir as cores que você usava
const COLORS = [
  "#1f77b4", // azul
  "#ff7f0e", // laranja
  "#2ca02c", // verde
  "#d62728", // vermelho
  "#9467bd", // roxo
  "#8c564b", // marrom
  "#e377c2", // rosa
  "#7f7f7f", // cinza
  "#bcbd22", // oliva
  "#17becf", // ciano
  // extras para girar melhor em conjuntos maiores
  "#4e79a7",
  "#f28e2b",
  "#e15759",
  "#76b7b2",
  "#59a14f",
  "#edc949",
  "#af7aa1",
  "#ff9da7",
  "#9c755f",
  "#bab0ac",
]

// 4. Aceitar a prop 'data' com os tipos corretos
export function CategoryChart({ data: faturas }: { data: Fatura[] }) {
  // 5. Processar os dados reais com useMemo
  const processedData = useMemo(() => {
    if (!faturas || faturas.length === 0) {
      return []
    }

    const categoryMap = new Map<string, number>()

    // Iterar por todas as faturas, extratos e transações
    faturas.forEach((f) => {
      const todosExtratos = f.extratos?.flat(2) ?? []
      todosExtratos.forEach((extrato) => {
        extrato?.transferencias?.forEach((t) => {
          if (!t) return
          // Apenas despesas: considerar valores negativos (usar valor absoluto)
          if (t.valor < 0) {
            const category = t.categoria || "Outros"
            const currentTotal = categoryMap.get(category) || 0
            const valueToAdd = Math.abs(t.valor || 0)
            categoryMap.set(category, currentTotal + valueToAdd)
          }
        })
      })
    })

    // Converter o Map para o formato que o gráfico espera
    // E calcular a porcentagem
    const totalValue = Array.from(categoryMap.values()).reduce((a, b) => a + b, 0)

    return Array.from(categoryMap.entries()).map(
      ([name, value], index) => ({
        name,
        value,
        color: COLORS[index % COLORS.length],
        // Calcula a porcentagem para a legenda
        percentage: totalValue === 0 ? 0 : Math.round((value / totalValue) * 100),
      }),
    )
  }, [faturas]) // Recalcula apenas quando as 'faturas' mudarem

  // 6. Atualizar o JSX para usar 'processedData'
  return (
    <div className="space-y-6">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={processedData} // <-- Usar dados processados
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
                fill={entry.color} // <-- Usar cor dinâmica
                stroke={entry.color}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Legenda dinâmica */}
      <div className="space-y-3 p-4">
        {processedData.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center">Sem despesas para exibir.</p>
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
