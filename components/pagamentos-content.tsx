"use client"

import { DollarSign, FileText, Clock, CreditCard } from "lucide-react"
import { Card } from "@/components/ui/card"
import { PaymentsChart } from "./payments-chart"
import { PaymentMethods } from "./payment-methods"

const metrics = [
  {
    title: "Recebido este Mês",
    value: "R$ 67.000",
    change: "+8.5% vs mês anterior",
    icon: DollarSign,
    trend: "up",
  },
  {
    title: "Taxa de Sucesso",
    value: "98.5%",
    change: "119 de 121 pagamentos",
    icon: FileText,
    trend: "neutral",
  },
  {
    title: "Tempo Médio",
    value: "2.3 dias",
    change: "Da emissão ao recebimento",
    icon: Clock,
    trend: "neutral",
  },
  {
    title: "Transações",
    value: "121",
    change: "Neste período",
    icon: CreditCard,
    trend: "neutral",
  },
]

const recentPayments = [
  {
    company: "Empresa Alpha",
    method: "Transferência",
    date: "15 Out 2025",
    amount: "+ R$ 12.500",
    status: "Concluído" as const,
  },
  {
    company: "Gamma Corp",
    method: "Boleto",
    date: "10 Out 2025",
    amount: "+ R$ 15.200",
    status: "Concluído" as const,
  },
  {
    company: "Epsilon Tech",
    method: "PIX",
    date: "05 Out 2025",
    amount: "+ R$ 11.300",
    status: "Concluído" as const,
  },
  {
    company: "Theta Enterprises",
    method: "Transferência",
    date: "01 Out 2025",
    amount: "+ R$ 14.800",
    status: "Concluído" as const,
  },
  {
    company: "Beta Solutions",
    method: "Boleto",
    date: "12 Out 2025",
    amount: "+ R$ 8.900",
    status: "Processando" as const,
  },
]

export function PagamentosContent() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Pagamentos</h1>
        <p className="text-muted-foreground mt-1">Acompanhe todos os pagamentos</p>
      </div>

      {/* Section Title */}
      <div>
        <h2 className="text-xl font-semibold text-foreground">Pagamentos</h2>
        <p className="text-sm text-muted-foreground">Acompanhe todos os pagamentos recebidos</p>
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
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  {metric.trend === "up" && "↗"}
                  {metric.change}
                </p>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 bg-card border-border">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground">Pagamentos Recebidos</h3>
            <p className="text-sm text-muted-foreground">Comparativo dos últimos 6 meses</p>
          </div>
          <PaymentsChart />
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground">Métodos de Pagamento</h3>
            <p className="text-sm text-muted-foreground">Distribuição atual</p>
          </div>
          <PaymentMethods />
        </Card>
      </div>

      {/* Recent Payments Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Pagamentos Recentes</h2>
            <p className="text-sm text-muted-foreground">Últimas transações processadas</p>
          </div>
        </div>

        <div className="space-y-4">
          {recentPayments.map((payment, index) => (
            <Card
              key={`${payment.company}-${index}`}
              className="p-6 bg-card/50 hover:bg-card transition-colors border-border"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-base font-semibold text-foreground">{payment.company}</span>
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium",
                          payment.status === "Concluído" && "bg-primary/20 text-primary",
                          payment.status === "Processando" && "bg-muted text-muted-foreground",
                        )}
                      >
                        {payment.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {payment.method} • {payment.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-foreground">{payment.amount}</p>
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
