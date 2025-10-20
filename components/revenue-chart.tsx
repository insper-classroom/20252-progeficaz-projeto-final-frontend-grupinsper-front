"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { month: "Jan", receita: 45000, despesas: 28000 },
  { month: "Fev", receita: 52000, despesas: 31000 },
  { month: "Mar", receita: 48000, despesas: 29000 },
  { month: "Abr", receita: 61000, despesas: 35000 },
  { month: "Mai", receita: 55000, despesas: 32000 },
  { month: "Jun", receita: 67000, despesas: 38000 },
]

const chartConfig = {
  receita: {
    label: "Receita",
    color: "hsl(var(--chart-1))",
  },
  despesas: {
    label: "Despesas",
    color: "hsl(var(--chart-2))",
  },
}

export function RevenueChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="month"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value / 1000}k`}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="receita" fill="var(--color-receita)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="despesas" fill="var(--color-despesas)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
