"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

const data = [
  { name: "Serviços", value: 35, color: "hsl(var(--chart-1))" },
  { name: "Produtos", value: 28, color: "hsl(var(--chart-2))" },
  { name: "Consultoria", value: 22, color: "hsl(var(--chart-3))" },
  { name: "Outros", value: 15, color: "hsl(var(--chart-4))" },
]

export function CategoryChart() {
  return (
    <div className="space-y-6">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-muted-foreground">{item.name}</span>
            </div>
            <span className="text-sm font-semibold text-foreground">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
