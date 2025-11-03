"use client"

import { DollarSign, CreditCard } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useMemo } from "react"
import { getFaturasDoUsuario } from "@/lib/api"
import { cn } from "@/lib/utils"
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

const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

// --- COMPONENTE DE GRÁFICO ---
function PaymentsChart({ data: faturas, view }: { data: Fatura[], view: 'recebidos' | 'feitos' }) {
  const processedData = useMemo(() => {
    if (!faturas || faturas.length === 0) {
      // Mesmo sem dados, mostra os 6 meses com valor 0
      const today = new Date()
      const emptyData = []
      for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
        emptyData.push({
          month: monthNames[d.getMonth()],
          value: 0,
        })
      }
      return emptyData
    }

    const monthAggregator = new Map<string, { total: number; monthIndex: number; year: number }>()
    const today = new Date()

    // Inicializa SEMPRE os últimos 6 meses (incluindo meses sem transações)
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
      const monthKey = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`
      monthAggregator.set(monthKey, { 
        total: 0, 
        monthIndex: d.getMonth(),
        year: d.getFullYear()
      })
    }
    
    const filterCondition = (t: Transferencia) => 
      view === 'recebidos' ? t.valor > 0 : t.valor < 0

    // Processa todas as transações e adiciona aos meses correspondentes
    faturas.forEach((f) => {
      f.extratos?.flat(2).forEach((extrato) => {
        extrato?.transferencias?.forEach((t) => {
          if (t && t.data && filterCondition(t)) {
            const transactionDate = parseDate(t.data)
            const monthKey = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth()).padStart(2, '0')}`
            
            const current = monthAggregator.get(monthKey)
            if (current) {
              current.total += Math.abs(t.valor)
            }
          }
        })
      })
    })
    
    // Retorna SEMPRE os 6 meses em ordem
    return Array.from(monthAggregator.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, values]) => ({
        month: monthNames[values.monthIndex],
        value: values.total,
      }))
  }, [faturas, view])

  const lineColor = view === 'recebidos' ? '#10b981' : '#ef4444'

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={processedData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
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
          tickFormatter={(tick) => `R$ ${(tick / 1000).toFixed(0)}k`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--popover))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
          }}
          formatter={(value: number) => [formatBRL(value), view === 'recebidos' ? 'Recebido' : 'Gasto']}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={lineColor}
          strokeWidth={3}
          dot={{
            fill: lineColor,
            r: 5,
            strokeWidth: 2,
            stroke: "hsl(var(--background))"
          }}
          activeDot={{
            r: 7,
            strokeWidth: 2,
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

// --- COMPONENTE DE MÉTODOS DE PAGAMENTO ---
function PaymentMethods({ data: faturas, view }: { data: Fatura[], view: 'recebidos' | 'feitos' }) {
  const processedData = useMemo(() => {
    if (!faturas || faturas.length === 0) return []

    const methodsMap = new Map<string, number>()
    
    const filterCondition = (t: Transferencia) => 
      view === 'recebidos' ? t.valor > 0 : t.valor < 0

    faturas.forEach((f) => {
      f.extratos?.flat(2).forEach((extrato) => {
        extrato?.transferencias?.forEach((t) => {
          if (t && filterCondition(t)) {
            const method = t.origem || "Outro"
            const currentValue = methodsMap.get(method) || 0
            methodsMap.set(method, currentValue + Math.abs(t.valor))
          }
        })
      })
    })

    const total = Array.from(methodsMap.values()).reduce((sum, val) => sum + val, 0)
    
    return Array.from(methodsMap.entries())
      .map(([name, value]) => ({
        name,
        value,
        percentage: total > 0 ? ((value / total) * 100).toFixed(1) : "0.0"
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
  }, [faturas, view])

  const colors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899']

  return (
    <div className="space-y-4">
      {processedData.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum dado disponível
        </div>
      ) : (
        processedData.map((item, index) => (
          <div key={item.name} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="font-medium text-foreground">{item.name}</span>
              </div>
              <span className="font-semibold text-foreground">{item.percentage}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: colors[index % colors.length]
                }}
              />
            </div>
            <div className="text-xs text-muted-foreground text-right">
              {formatBRL(item.value)}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

// --- COMPONENTE PRINCIPAL ---
export function PagamentosContent() {
  const [faturas, setFaturas] = useState<Fatura[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [view, setView] = useState<"recebidos" | "feitos">("recebidos")

  useEffect(() => {
    async function carregarFaturas() {
      try {
        setLoading(true)
        setError(null)
        const data = await getFaturasDoUsuario()
        setFaturas(Array.isArray(data) ? data : [])
      } catch (err: any) {
        console.error("Erro ao buscar faturas:", err)
        setError(err.message || "Não foi possível carregar os dados")
      } finally {
        setLoading(false)
      }
    }
    carregarFaturas()
  }, [])

  // --- PROCESSAR MÉTRICAS ---
  const processedMetrics = useMemo(() => {
    if (!faturas || faturas.length === 0) {
      return [
        { 
          title: "Total este Mês", 
          value: "R$ 0,00", 
          change: "Aguardando dados", 
          icon: DollarSign, 
          trend: "neutral" 
        },
        { 
          title: "Transações", 
          value: "0", 
          change: "Este período", 
          icon: CreditCard, 
          trend: "neutral" 
        },
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
        { 
          title: "Recebido este Mês", 
          value: formatBRL(recebidoEsteMes), 
          change: "+0% vs mês anterior", 
          icon: DollarSign, 
          trend: "up" 
        },
        { 
          title: "Transações Recebidas", 
          value: transacoesEsteMes.toString(), 
          change: "Este mês", 
          icon: CreditCard, 
          trend: "neutral" 
        },
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
        { 
          title: "Gasto este Mês", 
          value: formatBRL(Math.abs(gastoEsteMes)), 
          change: "-0% vs mês anterior", 
          icon: DollarSign, 
          trend: "down" 
        },
        { 
          title: "Transações Feitas", 
          value: transacoesEsteMes.toString(), 
          change: "Este mês", 
          icon: CreditCard, 
          trend: "neutral" 
        },
      ]
    }
  }, [faturas, view])

  // --- PROCESSAR PAGAMENTOS RECENTES ---
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
      amount: formatBRL(Math.abs(payment.valor)),
      rawAmount: payment.valor,
      status: (view === 'recebidos' ? "Concluído" : "Pago"),
    }))
  }, [faturas, view])

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
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
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          Array.from({ length: 2 }).map((_, index) => (
            <Card key={index} className="p-8 bg-card border-border animate-pulse h-[160px]">
              <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-10 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/3"></div>
            </Card>
          ))
        ) : (
          processedMetrics.map((metric) => {
            const Icon = metric.icon
            return (
              <Card key={metric.title} className="p-8 bg-card border-border hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-6">
                  <span className="text-sm font-medium text-muted-foreground">{metric.title}</span>
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-4xl font-bold text-foreground">{metric.value}</p>
                  <p className={cn(
                      "text-sm font-medium flex items-center gap-1",
                      metric.trend === "up" ? "text-green-600" : 
                      metric.trend === "down" ? "text-red-600" : 
                      "text-muted-foreground"
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
              {view === 'recebidos' ? "Evolução de Recebimentos" : "Evolução de Despesas"}
            </h3>
            <p className="text-sm text-muted-foreground">Últimos 6 meses</p>
          </div>
          {loading ? (
            <div className="h-[300px] flex items-center justify-center">
              <div className="text-muted-foreground">Carregando dados...</div>
            </div>
          ) : (
            <PaymentsChart data={faturas ?? []} view={view} />
          )}
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground">Origens</h3>
            <p className="text-sm text-muted-foreground">
              {view === 'recebidos' ? "De onde você recebe" : "Para onde você paga"}
            </p>
          </div>
          {loading ? (
            <div className="h-[300px] flex items-center justify-center">
              <div className="text-muted-foreground">Carregando...</div>
            </div>
          ) : (
            <PaymentMethods data={faturas ?? []} view={view} />
          )}
        </Card>
      </div>

      {/* Recent Payments Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {view === 'recebidos' ? "Recebimentos Recentes" : "Despesas Recentes"}
            </h2>
            <p className="text-sm text-muted-foreground">Últimas 5 transações</p>
          </div>
        </div>
        <div className="space-y-3">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-muted-foreground">Carregando transações...</div>
            </div>
          )}
          {error && (
            <Card className="p-6 bg-red-50 border-red-200">
              <p className="text-red-600">Erro: {error}</p>
            </Card>
          )}
          {!loading && !error && processedRecentPayments.length === 0 && (
            <Card className="p-12 bg-card/50 border-border border-dashed">
              <div className="text-center">
                <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Nenhuma transação encontrada</p>
              </div>
            </Card>
          )}
          
          {processedRecentPayments.map((payment) => (
            <Card key={payment.id} className="p-5 bg-card/50 hover:bg-card transition-all border-border hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-base font-semibold text-foreground">{payment.company}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        {payment.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {payment.method} • {payment.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "text-lg font-bold",
                    payment.rawAmount > 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {payment.rawAmount > 0 ? "+" : "-"} {payment.amount}
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