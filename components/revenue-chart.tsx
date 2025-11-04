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
export function RevenueChart({ data: faturas, anchorMonthKey }: { data: Fatura[]; anchorMonthKey?: string }) {
  
  // --- 4. Lógica de processamento (A mesma de antes, com ajustes) ---
  const processedData = useMemo(() => {
    if (!faturas || faturas.length === 0) {
      return []
    }

    // Helpers de data
    const parseDateFlexible = (dateStr?: string): Date | null => {
      if (!dateStr) return null
      if (dateStr.includes("/")) {
        const parts = dateStr.split("/")
        if (parts.length !== 3) return null
        const day = parseInt(parts[0])
        const month = parseInt(parts[1]) - 1
        const year = parseInt(parts[2])
        const d = new Date(year, month, day)
        return isNaN(d.getTime()) ? null : d
      }
      const d = new Date(dateStr)
      return isNaN(d.getTime()) ? null : d
    }
    const toKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const toLabel = (d: Date) => `${monthNames[d.getMonth()]}/${String(d.getFullYear()).slice(-2)}`

    // Monta o range de meses
    let monthsRange: { key: string; label: string; date: Date }[] = []
    if (anchorMonthKey) {
      const [y, m] = anchorMonthKey.split('-').map(Number)
      const anchor = new Date(y, (m || 1) - 1, 1)
      for (let i = -3; i <= 3; i++) {
        const d = new Date(anchor.getFullYear(), anchor.getMonth() + i, 1)
        monthsRange.push({ key: toKey(d), label: toLabel(d), date: d })
      }
    } else {
      // Comportamento antigo: últimos 6 meses a partir de hoje (inclusive)
      const today = new Date()
      for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
        monthsRange.push({ key: toKey(d), label: toLabel(d), date: d })
      }
    }

    const monthAggregator = new Map<string, { receita: number; despesas: number }>()
    monthsRange.forEach((m) => monthAggregator.set(m.key, { receita: 0, despesas: 0 }))

    const firstMonth = monthsRange[0].date
    const lastMonth = monthsRange[monthsRange.length - 1].date
    const rangeStart = new Date(firstMonth.getFullYear(), firstMonth.getMonth(), 1)
    const rangeEnd = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0) // fim do último mês

    // Itera e preenche os dados dentro do range
    faturas.forEach((f) => {
      const todosExtratos = f.extratos?.flat(2) ?? []
      todosExtratos.forEach((extrato) => {
        extrato?.transferencias?.forEach((t) => {
          if (!t || !t.data) return
          const transactionDate = parseDateFlexible(t.data)
          if (!transactionDate) return
          if (transactionDate < rangeStart || transactionDate > rangeEnd) return
          const key = toKey(new Date(transactionDate.getFullYear(), transactionDate.getMonth(), 1))
          const current = monthAggregator.get(key)
          if (!current) return
          if (t.valor > 0) current.receita += t.valor
          else current.despesas += Math.abs(t.valor)
        })
      })
    })

    // Converte preservando a ordem de monthsRange
    return monthsRange.map(({ key, label }) => {
      const values = monthAggregator.get(key) ?? { receita: 0, despesas: 0 }
      return { month: label, receita: values.receita, despesas: values.despesas }
    })
  }, [faturas, anchorMonthKey])

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
