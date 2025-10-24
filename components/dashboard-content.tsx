"use client"

import { DollarSign, FileText, Clock, TrendingUp, Download } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RevenueChart } from "./revenue-chart"
import { CategoryChart } from "./category-chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NovaFaturaModal } from "./nova-fatura-modal"
import { useState } from "react"

const metrics = [
  {
    title: "Receita Total",
    value: "R$ 67.000",
    change: "+12.5% vs mês anterior",
    icon: DollarSign,
    trend: "up",
  },
  {
    title: "Faturas Pagas",
    value: "24",
    change: "+8 este mês",
    icon: FileText,
    trend: "up",
  },
  {
    title: "Pendentes",
    value: "5",
    change: "R$ 42.350 em aberto",
    icon: Clock,
    trend: "neutral",
  },
  {
    title: "Taxa de Conversão",
    value: "82.7%",
    change: "-2.1% vs mês anterior",
    icon: TrendingUp,
    trend: "down",
  },
]

const recentInvoices = [
  {
    id: "INV-2024-089",
    company: "Empresa Alpha",
    amount: "R$ 12.500",
    date: "15 Out 2025",
    status: "Pago" as const,
  },
  {
    id: "INV-2024-088",
    company: "Beta Solutions",
    amount: "R$ 8.900",
    date: "12 Out 2025",
    status: "Pendente" as const,
  },
  {
    id: "INV-2024-087",
    company: "Gamma Corp",
    amount: "R$ 15.200",
    date: "10 Out 2025",
    status: "Pago" as const,
  },
  {
    id: "INV-2024-086",
    company: "Delta Industries",
    amount: "R$ 6.750",
    date: "08 Out 2025",
    status: "Atrasado" as const,
  },
  {
    id: "INV-2024-085",
    company: "Epsilon Tech",
    amount: "R$ 11.300",
    date: "05 Out 2025",
    status: "Pago" as const,
  },
]

export function DashboardContent() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleProcessFiles = async () => {
    for (const file of selectedFiles) {
      console.log('Processando:', file.name)
    }
    setSelectedFiles([])
  }

 return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Visão geral do seu negócio</p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="este-mes">
            <SelectTrigger className="w-[180px] bg-card border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="este-mes">Este mês</SelectItem>
              <SelectItem value="mes-passado">Mês passado</SelectItem>
              <SelectItem value="ultimos-3">Últimos 3 meses</SelectItem>
            </SelectContent>
          </Select>
          <NovaFaturaModal>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">+ Novo Extrato</Button>
          </NovaFaturaModal>
        </div>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.title} className="p-6 bg-card border-border">
              <div className="flex items-start justify-between mb-4">
                <span className="text-sm text-muted-foreground">{metric.title}</span>
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-foreground">{metric.value}</p>
                <p
                  className={cn(
                    "text-sm flex items-center gap-1",
                    metric.trend === "up"
                      ? "text-primary"
                      : metric.trend === "down"
                        ? "text-muted-foreground"
                        : "text-muted-foreground",
                  )}
                >
                  {metric.trend === "up" && "↗"}
                  {metric.trend === "down" && "↘"}
                  {metric.change}
                </p>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Receita vs Despesas</h3>
              <p className="text-sm text-muted-foreground">Últimos 6 meses</p>
            </div>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Download className="w-4 h-4" />
            </Button>
          </div>
          <RevenueChart />
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground">Distribuição por Categoria</h3>
            <p className="text-sm text-muted-foreground">Receita por tipo</p>
          </div>
          <CategoryChart />
        </Card>
      </div>

      {/* Recent Invoices Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Faturas Recentes</h2>
            <p className="text-sm text-muted-foreground">Últimas transações registradas</p>
          </div>
          <Button variant="ghost" className="text-foreground hover:bg-card">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>

        <div className="space-y-4">
          {recentInvoices.map((invoice, index) => (
            <Card
              key={invoice.id}
              className={cn(
                "p-6 bg-card/50 hover:bg-card transition-colors",
                index === 0 ? "border-primary/50" : "border-border",
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-muted/30 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-base font-semibold text-foreground">{invoice.id}</span>
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium",
                          invoice.status === "Pago" && "bg-primary/20 text-primary",
                          invoice.status === "Pendente" && "bg-muted text-muted-foreground",
                          invoice.status === "Atrasado" && "bg-orange-900/30 text-orange-400",
                        )}
                      >
                        {invoice.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{invoice.company}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-foreground">{invoice.amount}</p>
                  <p className="text-sm text-muted-foreground">{invoice.date}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
