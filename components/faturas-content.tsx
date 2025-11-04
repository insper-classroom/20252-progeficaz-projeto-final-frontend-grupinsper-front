"use client"

import { useEffect, useMemo, useState } from "react"
import { FileText, Download, TrendingDown } from "lucide-react" // FileText já estava aqui
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
      
      // *** MODIFICAÇÃO PARA PEGAR O NOME DO BANCO ***
      // Tenta pegar o primeiro nome de banco encontrado nos extratos
      let nomeBanco = "Fatura" // Valor padrão
      if (todosExtratos.length > 0 && todosExtratos[0]?.banco) {
         nomeBanco = todosExtratos[0].banco
      } else {
         // Se não achar banco, usa o nome da fatura
         nomeBanco = f.fatura || f.fatura2 || f.fatura3 || "Fatura"
      }
      
      todosExtratos.forEach((extrato) => {
        extrato?.transferencias?.forEach((t) => {
          valorTotal += t.valor
        })
      })
      
      // const nomeFatura = f.fatura || f.fatura2 || f.fatura3 || "Fatura" // Linha antiga
      
      let dataFatura = "Sem data"
      if (f.data_criacao) {
        const dateObj = new Date(f.data_criacao)
        if (!isNaN(dateObj.getTime())) {
          dataFatura = dateObj.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short", // 'short' (ex: "nov.") ou 'long' (ex: "novembro")
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
        company: nomeBanco, // Agora 'company' é o nome do banco ou da fatura
        amount: formatBRL(valorTotal),
        amountRaw: valorTotal,
        date: dataFatura,
        status: statusFatura, // Mantemos o status caso precise no futuro
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

  // Novos cálculos de resumo financeiro (sem mudanças)
  const financialSummary = useMemo(() => {
    if (!faturas) return { receita: 0, despesas: 0, saldo: 0, totalTransacoes: 0 }
    
    let receita = 0
    let despesas = 0
    let totalTransacoes = 0
    
    faturas.forEach((f) => {
      f.extratos?.flat(2).forEach((extrato) => {
        extrato?.transferencias?.forEach((t) => {
          totalTransacoes++
          if (t.valor > 0) {
            receita += t.valor
          } else {
            despesas += Math.abs(t.valor)
          }
        })
      })
    })
    
    return {
      receita,
      despesas,
      saldo: receita - despesas,
      totalTransacoes
    }
  }, [faturas])

  return (
    <div className="p-8 space-y-8">
      {/* NOVO LAYOUT 2x2 GRID (sem mudanças) */}
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


      {/* ***** INÍCIO DA SEÇÃO MODIFICADA (ADEUS TABELA) ***** */}
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
        
        {/* Nova Lista de Cards */}
        <div className="space-y-4">
          {loading && (
            <p className="text-sm text-muted-foreground text-center">
              Carregando faturas...
            </p>
          )}
          
          {error && (
             <p className="text-sm text-red-500 text-center">
               Erro: {error}
             </p>
          )}
          
          {!loading && !error && processedFaturas.length === 0 && (
             <p className="text-sm text-muted-foreground text-center">
               Nenhuma fatura encontrada.
             </p>
          )}

          {!loading &&
            !error &&
            processedFaturas.map((invoice, index) => (
              <Card
                key={invoice.id}
                className={cn(
                  "p-4 sm:p-6 bg-card/50 hover:bg-card/90 transition-colors",
                  index === 0 ? "border-primary/20" : "border-border",
                )}
              >
                <div className="flex items-center justify-between">
                  {/* Lado Esquerdo: Ícone, Nome do Banco e Data */}
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex w-10 h-10 rounded-lg bg-muted/30 items-center justify-center">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-base font-semibold text-foreground">
                          {invoice.company} 
                        </span>
                        {/* OPCIONAL: Se quiser manter o Badge de status, descomente aqui.
                          O estilo do badge "Pendente" (muted) é o mesmo da segunda imagem. 
                        */}
                        {/* <Badge
                          variant="secondary"
                           className="bg-muted text-muted-foreground hover:bg-muted border-0"
                        >
                          {invoice.status}
                        </Badge> */}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {invoice.date}
                      </p>
                    </div>
                  </div>
                  
                  {/* Lado Direito: Valor e Subtexto */}
                  <div className="text-right">
                    <p className={cn(
                      "text-lg font-semibold",
                      invoice.amountRaw > 0 ? "text-green-500" : (invoice.amountRaw < 0 ? "text-red-500" : "text-foreground")
                    )}>
                      {invoice.amount}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Saldo resultante
                    </p>
                  </div>
                </div>
              </Card>
            ))}
        </div>
        {/* ***** FIM DA SEÇÃO MODIFICADA ***** */}
        
      </Card>
    </div>
  )
}