"use client"

import { useMemo } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// --- 1. Definição de Tipos (Igual ao dashboard-content.tsx) ---
type Transferencia = {
  valor: number
  data: string // Assumindo formato DD/MM/YYYY
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

// --- 2. Configuração do Gráfico (Do seu exemplo) ---
const chartConfig = {
  receita: {
    label: "Receita",
    color: "#10b981", // Verde
  },
  despesas: {
    label: "Despesas",
    color: "#ef4444", // Vermelho
  },
}

// Nomes dos meses em português
const monthNames = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
]

// --- 3. Aceitar a prop 'data' com os dados reais ---
export function RevenueChart({ data: faturas }: { data: Fatura[] }) {
  
  // --- 4. Lógica de processamento (A mesma de antes, com ajustes) ---
  const processedData = useMemo(() => {
    if (!faturas || faturas.length === 0) {
      return []
    }

    const monthAggregator = new Map<string, { receita: number; despesas: number }>()
    const today = new Date()

    // Inicializa os últimos 6 meses no Map
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
      const monthKey = monthNames[d.getMonth()]
      if (!monthAggregator.has(monthKey)) {
        monthAggregator.set(monthKey, { receita: 0, despesas: 0 })
      }
    }
    
    const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1)
    sixMonthsAgo.setHours(0, 0, 0, 0)

    // Itera e preenche os dados
    faturas.forEach((f) => {
      const todosExtratos = f.extratos?.flat(2) ?? []
      todosExtratos.forEach((extrato) => {
        extrato?.transferencias?.forEach((t) => {
          if (!t || !t.data) return
          
          const parts = t.data.split("/")
          if (parts.length !== 3) return

          const transactionDate = new Date(
            parseInt(parts[2]), // ano
            parseInt(parts[1]) - 1, // mês (base 0)
            parseInt(parts[0]), // dia
          )

          if (transactionDate < sixMonthsAgo) {
            return
          }

          const monthKey = monthNames[transactionDate.getMonth()]
          const current = monthAggregator.get(monthKey)

          if (current) {
            if (t.valor > 0) {
              current.receita += t.valor
            } else {
              current.despesas += Math.abs(t.valor)
            }
          }
        })
      })
    })

    // Converte o Map para o formato do gráfico
    // **Ajuste:** Usar 'month', 'receita', 'despesas' (minúsculo)
    return Array.from(monthAggregator.entries()).map(([name, values]) => ({
      month: name,
      receita: values.receita,
      despesas: values.despesas,
    }))
  }, [faturas])

  // --- 5. JSX Remodelado ---
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        {/* Usar 'processedData' em vez de 'data' estático */}
        <BarChart data={processedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4F4F4F" vertical={false} />
          <XAxis
            dataKey="month" // Chave 'month' do nosso 'processedData'
            stroke="var(--muted-foreground)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="var(--muted-foreground)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value / 1000}k`}
          />
          {/* Tooltip do shadcn/ui */}
          <ChartTooltip
            content={<ChartTooltipContent />}
            cursor={{ fill: "hsl(var(--muted) / 0.5)" }} // Bônus: melhora o cursor
          />
          <Bar
            dataKey="receita" // Chave 'receita' (minúsculo)
            fill="var(--color-receita)" // Cor do chartConfig
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="despesas" // Chave 'despesas' (minúsculo)
            fill="var(--color-despesas)" // Cor do chartConfig
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
