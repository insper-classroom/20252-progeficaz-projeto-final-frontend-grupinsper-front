"use client"

import { useEffect, useMemo, useState } from "react"
import { FileText, Download } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RevenueChart } from "./revenue-chart"
import { CategoryChart } from "./category-chart"
import { getFaturasDoUsuario } from "@/lib/api" // <-- IMPORTAR API

type Fatura = {
  _id: string
  user_id?: string
  mes_ano?: string
  fatura?: string
  extratos?: any[]
  valor?: number
  status?: string
  created_at?: string
}

export function FaturasContent() {
  const USER_ID = "68f3859b16ccde5a56ca370d"
  const [faturas, setFaturas] = useState<Fatura[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    async function carregar() {
      setLoading(true)
      setError(null)
      try {
        const data = await getFaturasDoUsuario(USER_ID)
        console.log("Faturas recebidas:", data)
        if (!mounted) return
        setFaturas(Array.isArray(data) ? data : [])
      } catch (err: any) {
        console.error("Erro ao buscar faturas:", err)
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

  // prepara lista recente com shape esperado pelo layout
  const recentInvoices = useMemo(() => {
    if (!faturas) return []
    return faturas.slice(0, 6).map((f) => ({
      id: f._id,
      company: f.fatura ?? "Cliente",
      amount: typeof f.valor === "number" ? `R$ ${f.valor.toLocaleString()}` : `R$ ${(f.extratos?.length ?? 0) * 100}`,
      date: f.mes_ano ?? f.created_at ?? "—",
      status: (f.status ?? "Pendente"),
    }))
  }, [faturas])

  return (
    <div className="p-8 space-y-8">
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Receita vs Despesas</h3>
              <p className="text-sm text-muted-foreground">Últimos 6 meses</p>
            </div>
          </div>
          {/* passe as faturas reais para o chart se ele aceitar data */}
          <RevenueChart data={faturas ?? []} />
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground">Distribuição por Categoria</h3>
            <p className="text-sm text-muted-foreground">Receita por tipo</p>
          </div>
          <CategoryChart data={faturas ?? []} />
        </Card>
      </div>

      {/* Recent Invoices */}
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Faturas Recentes</h3>
            <p className="text-sm text-muted-foreground">Últimas transações registradas</p>
          </div>
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>

        <div className="space-y-4">
          {loading && <div>Carregando faturas...</div>}
          {error && <div className="text-red-500">Erro: {error}</div>}
          {!loading && !error && recentInvoices.length === 0 && <div>Nenhuma fatura encontrada.</div>}

          {recentInvoices.map((invoice) => (
            <div
              key={invoice.id}
              className="flex items-center justify-between p-4 rounded-lg bg-background/50 hover:bg-background transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                  <FileText className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-foreground">{invoice.id}</span>
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
                  </div>
                  <p className="text-sm text-muted-foreground">{invoice.company}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground">{invoice.amount}</p>
                <p className="text-sm text-muted-foreground">{invoice.date}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

