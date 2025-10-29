// Em components/payments-chart.tsx
"use client"

import { useMemo } from "react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"

// --- DEFINIÇÃO DE TIPOS ---
// ... (Copie os tipos Fatura, ExtratoItem, Transferencia)
type Transferencia = { valor: number; data: string; origem: string; categoria: string }
type ExtratoItem = { banco: string; _id: string; transferencias: Transferencia[] }
type Fatura = { _id: string; extratos?: ExtratoItem[][] }
// --- FIM DOS TIPOS ---

function parseDate(dateString: string): Date {
  const parts = dateString.split("/")
  if (parts.length === 3) {
    return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]))
  }
  return new Date(0)
}

const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

// ***** ACEITA 'view' COMO PROP *****
export function PaymentsChart({ data: faturas, view }: { data: Fatura[], view: 'recebidos' | 'feitos' }) {
  
  const processedData = useMemo(() => {
    if (!faturas || faturas.length === 0) return []

    const monthAggregator = new Map<string, { total: number }>()
    const today = new Date("2024-10-28T12:00:00") 

    for (let i = 5; i >= 0; i--) {
      // ... (inicialização dos meses, sem mudança) ...
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
      const monthKey = monthNames[d.getMonth()]
      if (!monthAggregator.has(monthKey)) {
        monthAggregator.set(monthKey, { total: 0 })
      }
    }
    
    const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1)
    sixMonthsAgo.setHours(0, 0, 0, 0)
    
    // ***** LÓGICA DE FILTRO DINÂMICA *****
    const filterCondition = (t: Transferencia) => 
      view === 'recebidos' ? t.valor > 0 : t.valor < 0

    faturas.forEach((f) => {
      f.extratos?.flat(2).forEach((extrato) => {
        extrato?.transferencias?.forEach((t) => {
          
          if (t && t.data && filterCondition(t)) { // <-- FILTRO APLICADO
            const transactionDate = parseDate(t.data)
            if (transactionDate < sixMonthsAgo) return 
            
            const monthKey = monthNames[transactionDate.getMonth()]
            const current = monthAggregator.get(monthKey)
            
            if (current) {
              // Usa valor absoluto para despesas
              current.total += (view === 'recebidos' ? t.valor : Math.abs(t.valor))
            }
          }
        })
      })
    })
    
    return Array.from(monthAggregator.entries()).map(([name, values]) => ({
      month: name,
      value: values.total,
    }))
  }, [faturas, view]) // <-- 'view' ADICIONADO À DEPENDÊNCIA

  const formatTooltipValue = (value: number) => {
    return formatBRL(value)
  }

  const formatYAxis = (tick: number) => {
    return `${tick / 1000}k`
  }

  // ***** COR DA LINHA DINÂMICA *****
  const lineColor = view === 'recebidos' ? 'var(--chart-1)' : 'var(--chart-2)'

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={processedData}>
        {/* ... (Grid, XAxis, YAxis, Tooltip, sem mudanças) ... */}
        <Line
          type="monotone"
          dataKey="value"
          stroke={lineColor} // <-- COR DINÂMICA
          strokeWidth={2}
          dot={{
            fill: lineColor, // <-- COR DINÂMICA
            r: 4,
          }}
          activeDot={{
            r: 6,
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}