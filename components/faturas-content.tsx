"use client"

import { useEffect, useMemo, useState } from "react"
import { FileText, Download, TrendingDown } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { RevenueChart } from "@/components/revenue-chart"
import { CategoryChart } from "@/components/category-chart"
import { BankAnalysis } from "@/components/bank-analysis" 
import { getFaturasDoUsuario } from "@/lib/api"
import { cn } from "@/lib/utils"

// --- DEFINIÇÃO DE TIPOS ---
type Transferencia = { valor: number; data: string; origem: string; categoria: string }
type ExtratoItem = { banco: string; _id: string; transferencias: Transferencia[] }
type Fatura = {
  _id: string
  user_id?: string
  fatura?: string
  fatura2?: string
  fatura3?: string
  mes_ano?: string
  created_at?: string
  status?: string
  data_criacao?: string
  extratos?: ExtratoItem[][]
}
// --- FIM DOS TIPOS ---

const formatBRL = (val: number) =>
  val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

const EXPENSE_COLORS = [
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-1)",
]

export function FaturasContent() {
  const [faturas, setFaturas] = useState<Fatura[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // useEffect (sem mudanças)
  useEffect(() => {
    let mounted = true
    async function carregar() {
      setLoading(true)
      setError(null)
      try {
        const data = await getFaturasDoUsuario()
        if (!mounted) return
        setFaturas(Array.isArray(data) ? data : [])
      } catch (err: any) {
        setError(err?.message ?? "Erro ao buscar faturas")
        setFaturas([])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    carregar()
    return () => {
      mounted = false
    }
  }, [])

  // useMemo 'processedFaturas' (sem mudanças)
  const processedFaturas = useMemo(() => {
    if (!faturas) return []
    return faturas.map((f) => {
      let valorTotal = 0
      const todosExtratos = f.extratos?.flat(2) ?? []
      todosExtratos.forEach((extrato) => {
        extrato?.transferencias?.forEach((t) => {
          valorTotal += t.valor
        })
      })
      const nomeFatura = f.fatura || f.fatura2 || f.fatura3 || "Fatura"
      let dataFatura = "Sem data"
      if (f.data_criacao) {
        const dateObj = new Date(f.data_criacao)
        if (!isNaN(dateObj.getTime())) {
          dataFatura = dateObj.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        }
      } else if (f.mes_ano) {
        dataFatura = f.mes_ano
      } else if (f.created_at) {
        dataFatura = new Date(f.created_at).toLocaleDateString("pt-BR")
      }
      const statusFatura = f.status ?? "Pendente"
      return {
        id: f._id,
        company: nomeFatura,
        amount: formatBRL(valorTotal),
        amountRaw: valorTotal,
        date: dataFatura,
        status: statusFatura,
      }
    })
  }, [faturas])

  // useMemo 'topExpenses' (sem mudanças)
  const topExpenses = useMemo(() => {
    if (!faturas) return []
    const expenseMap = new Map<string, number>()
    let totalValue = 0
    faturas.forEach((f) => {
      f.extratos?.flat(2).forEach((extrato) => {
        extrato?.transferencias?.forEach((t) => {
          if (t && t.valor < 0) {
            const category = t.categoria || "Outros"
            const currentTotal = expenseMap.get(category) || 0
            const value = Math.abs(t.valor)
            expenseMap.set(category, currentTotal + value)
            totalValue += value
          }
        })
      })
    })
    if (totalValue === 0) return []
    return Array.from(expenseMap.entries())
      .map(([name, value], index) => ({
        name,
        value,
        percentage: Math.round((value / totalValue) * 100),
        color: EXPENSE_COLORS[index % EXPENSE_COLORS.length],
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
  }, [faturas])

  return (
    <div className="p-8 space-y-8">
      {/* NOVO LAYOUT 2x2 GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CÉLULA 1: Gráfico de Receita vs Despesa */}
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Receita vs Despesas
              </h3>
              <p className="text-sm text-muted-foreground">Últimos 6 meses</p>
            </div>
          </div>
          <RevenueChart data={faturas ?? []} />
        </Card>

        {/* CÉLULA 2: Gráfico de Categoria (Receita) */}
        <Card className="p-6 bg-card border-border">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              Distribuição por Categoria
            </h3>
            <p className="text-sm text-muted-foreground">Receita por Categoria</p>
          </div>
          <CategoryChart data={faturas ?? []} />
        </Card>

        {/* CÉLULA 3: Card de Top Despesas */}
        <Card className="p-6 bg-card border-border">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              Top 5 Despesas
            </h3>
            <p className="text-sm text-muted-foreground">Por Categoria (todo o período)</p>
          </div>
          <div className="space-y-4">
            {topExpenses.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center">
                Nenhuma despesa encontrada.
              </p>
            ) : (
              topExpenses.map((item) => (
                <div key={item.name} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center"
                        style={{ color: item.color }}
                  >
                    <TrendingDown className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="text-sm font-semibold">{formatBRL(item.value)}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* CÉLULA 4: Card de Análise por Banco */}
        <Card className="p-6 bg-card border-border">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              Análise por Banco
            </h3>
            <p className="text-sm text-muted-foreground">Recebimentos vs. Despesas</p>
          </div>
          <BankAnalysis data={faturas ?? []} />
        </Card>
        
      </div>
      {/* FIM DO NOVO LAYOUT 2x2 */}


      {/* Tabela de Faturas */}
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Todas as Faturas
            </h3>
            <p className="text-sm text-muted-foreground">
              Lista de todas as faturas registradas
            </p>
          </div>
          
        </div>
        
        {/* ***** INÍCIO DA CORREÇÃO ***** */}
        {/* O conteúdo da tabela que estava faltando */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fatura</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Carregando faturas...
                </TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-red-500">
                  Erro: {error}
                </TableCell>
              </TableRow>
            )}
            {!loading && !error && processedFaturas.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Nenhuma fatura encontrada.
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              !error &&
              processedFaturas.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <div className="font-medium">{invoice.company}</div>
                    <div className="text-xs text-muted-foreground">
                      ID: {invoice.id}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={invoice.status === "Pago" ? "default" : "secondary"}
                      className={
                        invoice.status === "Pago"
                          ? "bg-primary/20 text-primary hover:bg-primary/30 border-0"
                          : "bg-muted text-muted-foreground hover:bg-muted border-0"
                      }
                    >
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell className={cn(
                    "text-right font-medium",
                    invoice.amountRaw > 0 ? "text-green-500" : "text-red-500"
                  )}>
                    {invoice.amount}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {/* ***** FIM DA CORREÇÃO ***** */}
      </Card>
    </div>
  )
}