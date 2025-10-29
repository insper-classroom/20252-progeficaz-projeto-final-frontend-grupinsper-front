// Em app/pagamentos/pagamentos-content.tsx
"use client"

import { DollarSign, FileText, Clock, CreditCard } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PaymentsChart } from "./payments-chart"
import { PaymentMethods } from "./payment-methods"
import { useState, useEffect, useMemo } from "react"
import { getFaturasDoUsuario } from "@/lib/api"
import { cn } from "@/lib/utils"

// --- DEFINIÇÃO DE TIPOS ---
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
  user_id: string
  extratos?: ExtratoItem[][]
}
// --- FIM DOS TIPOS ---

const formatBRL = (val: number) =>
  val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

function parseDate(dateString: string): Date {
  const parts = dateString.split("/")
  if (parts.length === 3) {
    return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]))
  }
  return new Date(0)
}

export function PagamentosContent() {
  const USER_ID = "68f3859b16ccde5a56ca370d"
  const [faturas, setFaturas] = useState<Fatura[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [view, setView] = useState<"recebidos" | "feitos">("recebidos")

  useEffect(() => {
    async function carregarFaturas() {
      try {
        setLoading(true)
        setError(null)
        const data = await getFaturasDoUsuario(USER_ID)
        setFaturas(Array.isArray(data) ? data : [])
      } catch (err: any) {
        console.error("Erro ao buscar faturas:", err)
        setError(err.message || "Não foi possível carregar os dados")
      } finally {
        setLoading(false)
      }
    }
    carregarFaturas()
  }, [USER_ID])

  // --- PROCESSAR MÉTRICAS (AGORA DEPENDE DO 'view') ---
  const processedMetrics = useMemo(() => {
    if (!faturas || faturas.length === 0) {
      return [
        { title: "Recebido este Mês", value: "R$ 0,00", change: "..." },
        { title: "Taxa de Sucesso", value: "N/A", change: "Dados indisponíveis" },
        { title: "Tempo Médio", value: "N/A", change: "Dados indisponíveis" },
        { title: "Transações", value: "0", change: "Este período" },
      ]
    }

    const today = new Date("2024-10-28T12:00:00")
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()

    if (view === "recebidos") {
      let recebidoEsteMes = 0
      let transacoesEsteMes = 0
      faturas.forEach((f) => {
        f.extratos?.flat(2).forEach((extrato) => {
          extrato?.transferencias?.forEach((t) => {
            if (t && t.valor > 0) {
              const txDate = parseDate(t.data)
              if (txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear) {
                recebidoEsteMes += t.valor
                transacoesEsteMes++
              }
            }
          })
        })
      })
      return [
        { title: "Recebido este Mês", value: formatBRL(recebidoEsteMes), change: "+0% vs mês anterior", icon: DollarSign, trend: "up" },
        { title: "Taxa de Sucesso", value: "N/A", change: "Dados indisponíveis", icon: FileText, trend: "neutral" },
        { title: "Tempo Médio", value: "N/A", change: "Dados indisponíveis", icon: Clock, trend: "neutral" },
        { title: "Transações", value: transacoesEsteMes.toString(), change: "Recebidas este mês", icon: CreditCard, trend: "neutral" },
      ]
    } else {
      let gastoEsteMes = 0
      let transacoesEsteMes = 0
      faturas.forEach((f) => {
        f.extratos?.flat(2).forEach((extrato) => {
          extrato?.transferencias?.forEach((t) => {
            if (t && t.valor < 0) {
              const txDate = parseDate(t.data)
              if (txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear) {
                gastoEsteMes += t.valor
                transacoesEsteMes++
              }
            }
          })
        })
      })
      return [
        { title: "Gasto este Mês", value: formatBRL(gastoEsteMes), change: "-0% vs mês anterior", icon: DollarSign, trend: "down" },
        { title: "Taxa de Sucesso", value: "N/A", change: "Dados indisponíveis", icon: FileText, trend: "neutral" },
        { title: "Tempo Médio", value: "N/A", change: "Dados indisponíveis", icon: Clock, trend: "neutral" },
        { title: "Transações", value: transacoesEsteMes.toString(), change: "Feitas este mês", icon: CreditCard, trend: "neutral" },
      ]
    }
  }, [faturas, view])

  // --- PROCESSAR PAGAMENTOS RECENTES (AGORA DEPENDE DO 'view') ---
  const processedRecentPayments = useMemo(() => {
    if (!faturas) return []

    const allTransactions: any[] = []
    
    const filterCondition = (t: Transferencia) => 
      view === 'recebidos' ? t.valor > 0 : t.valor < 0

    faturas.forEach((f) => {
      f.extratos?.flat(2).forEach((extrato) => {
        extrato?.transferencias?.forEach((t, index) => {
          if (t && filterCondition(t)) {
            allTransactions.push({
              ...t,
              id: `${extrato._id}-${index}`,
              parsedDate: parseDate(t.data),
            })
          }
        })
      })
    })

    allTransactions.sort((a, b) => b.parsedDate.getTime() - a.parsedDate.getTime())

    return allTransactions.slice(0, 5).map((payment) => ({
      id: payment.id,
      company: payment.categoria || (view === 'recebidos' ? "Recebido" : "Despesa"),
      method: payment.origem || "Outro",
      date: payment.data,
      amount: formatBRL(payment.valor),
      status: (view === 'recebidos' ? "Concluído" : "Pago") as const,
    }))
  }, [faturas, view])

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {view === 'recebidos' ? "Recebimentos" : "Despesas"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {view === 'recebidos' ? "Acompanhe todos os pagamentos recebidos" : "Acompanhe todas as suas despesas"}
        </p>
      </div>

      {/* SELETOR DE VIEW */}
      <div className="flex items-center gap-2">
        <Button
          variant={view === 'recebidos' ? 'default' : 'outline'}
          onClick={() => setView('recebidos')}
        >
          Recebidos
        </Button>
        <Button
          variant={view === 'feitos' ? 'default' : 'outline'}
          onClick={() => setView('feitos')}
        >
          Feitos
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          
          // ***** INÍCIO DA CORREÇÃO *****
          // Este é o código de "skeleton" que estava faltando
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="p-6 bg-card border-border animate-pulse h-[138px]">
              <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/3"></div>
            </Card>
          ))
          // ***** FIM DA CORREÇÃO *****

        ) : (
          processedMetrics.map((metric) => {
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
                  <p className={cn(
                      "text-sm text-muted-foreground flex items-center gap-1",
                      metric.trend === "up" ? "text-primary" : metric.trend === "down" ? "text-red-500" : ""
                  )}>
                    {metric.trend === "up" && "↗"}
                    {metric.trend === "down" && "↘"}
                    {metric.change}
                  </p>
                </div>
              </Card>
            )
          })
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 bg-card border-border">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              {view === 'recebidos' ? "Pagamentos Recebidos" : "Pagamentos Feitos"}
            </h3>
            <p className="text-sm text-muted-foreground">Comparativo dos últimos 6 meses</p>
          </div>
          <PaymentsChart data={faturas ?? []} view={view} />
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground">Métodos de Pagamento</h3>
            <p className="text-sm text-muted-foreground">
              {view === 'recebidos' ? "Distribuição de receitas" : "Distribuição de despesas"}
            </p>
          </div>
          <PaymentMethods data={faturas ?? []} view={view} />
        </Card>
      </div>

      {/* Recent Payments Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {view === 'recebidos' ? "Pagamentos Recebidos Recentes" : "Pagamentos Feitos Recentes"}
            </h2>
            <p className="text-sm text-muted-foreground">Últimas transações processadas</p>
          </div>
        </div>
        <div className="space-y-4">
          {loading && <div>Carregando...</div>}
          {error && <div className="text-red-500">Erro: {error}</div>}
          {!loading && !error && processedRecentPayments.length === 0 && (
            <div>Nenhuma transação encontrada.</div>
          )}
          
          {processedRecentPayments.map((payment) => (
            <Card key={payment.id} className="p-6 bg-card/50 hover:bg-card transition-colors border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-base font-semibold text-foreground">{payment.company}</span>
                      <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium",
                          (payment.status === "Concluído" || payment.status === "Pago") && "bg-primary/20 text-primary",
                      )}>
                        {payment.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {payment.method} • {payment.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-foreground">
                    {payment.amount}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}