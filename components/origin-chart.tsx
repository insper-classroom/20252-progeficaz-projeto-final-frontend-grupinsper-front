// Em components/origin-chart.tsx
"use client"

import { useMemo, useState } from "react"
import { PieChart, Pie, ResponsiveContainer, Cell } from "recharts"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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

// Paleta estendida para maior variedade (d3 + extras)
const COLORS = [
  "#1f77b4",
  "#ff7f0e",
  "#2ca02c",
  "#d62728",
  "#9467bd",
  "#8c564b",
  "#e377c2",
  "#7f7f7f",
  "#bcbd22",
  "#17becf",
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

export function OriginChart({ data: faturas }: { data: Fatura[] }) {
  const [tipo, setTipo] = useState<"receita" | "despesa">("receita")

  const processedData = useMemo(() => {
    if (!faturas || faturas.length === 0) {
      return []
    }
    const originMap = new Map<string, number>()
    faturas.forEach((f) => {
      const todosExtratos = f.extratos?.flat(2) ?? []
      todosExtratos.forEach((extrato) => {
        extrato?.transferencias?.forEach((t) => {
          if (!t) return
          const isReceita = t.valor > 0
          if ((tipo === "receita" && isReceita) || (tipo === "despesa" && !isReceita)) {
            const origin = t.origem || "Outra Origem"
            originMap.set(origin, (originMap.get(origin) || 0) + Math.abs(t.valor))
          }
        })
      })
    })
    const entries = Array.from(originMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, value], index) => ({
        name,
        value,
        color: COLORS[index % COLORS.length],
      }))
    const total = entries.reduce((acc, e) => acc + e.value, 0)
    return entries.map((e) => ({
      ...e,
      percentage: total === 0 ? 0 : Math.round((e.value / total) * 100),
    }))
  }, [faturas, tipo])

  // ... (O resto do seu JSX é o mesmo) ...
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select value={tipo} onValueChange={(v) => setTipo(v as "receita" | "despesa")}>
          <SelectTrigger className="w-[160px] h-8 text-xs bg-card border-border">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="receita">Receita</SelectItem>
            <SelectItem value="despesa">Despesas</SelectItem>
          </SelectContent>
        </Select>
      </div>
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
            nameKey="name"
          >
            {processedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />
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