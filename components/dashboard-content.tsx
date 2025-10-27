// Em app/dashboard/dashboard-content.tsx
"use client"

import {
  DollarSign,
  FileText,
  Clock,
  TrendingUp,
  Download,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RevenueChart } from "./revenue-chart"
import { CategoryChart } from "./category-chart"
import { OriginChart } from "./origin-chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { NovaFaturaModal } from "./nova-fatura-modal"
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
  fatura?: string
  fatura2?: string
  fatura3?: string
  data_criacao?: string
  extratos?: ExtratoItem[][]
}
// --- FIM DOS TIPOS ---

export function DashboardContent() {
  const USER_ID = "68f3859b16ccde5a56ca370d"
  const [faturas, setFaturas] = useState<Fatura[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // useEffect para carregarFaturas
  useEffect(() => {
    async function carregarFaturas() {
      try {
        setLoading(true);
        setError(null);
        const data = await getFaturasDoUsuario(USER_ID);
        setFaturas(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error("Erro ao buscar faturas:", err);
        setError(err.message || "Não foi possível carregar os dados");
      } finally {
        setLoading(false);
      }
    }
    carregarFaturas();
  }, [USER_ID]);

  // useMemo para processedMetrics
  const processedMetrics = useMemo(() => {
    if (!faturas || faturas.length === 0) {
      return [
        { title: "Receita Total", value: "R$ 0,00", change: "..." },
        { title: "Faturas Registradas", value: "0", change: "..." },
        { title: "Pendentes", value: "0", change: "..." },
        { title: "Despesas Totais", value: "R$ 0,00", change: "..." },
      ];
    }
    let receitaTotal = 0;
    let despesaTotal = 0;
    faturas.forEach((f) => {
      const todosExtratos = f.extratos?.flat(2) ?? [];
      todosExtratos.forEach((extrato) => {
        extrato?.transferencias?.forEach((t) => {
          if (t.valor > 0) {
            receitaTotal += t.valor;
          } else {
            despesaTotal += t.valor;
          }
        });
      });
    });
    const formatBRL = (val: number) =>
      val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    return [
      {
        title: "Receita Total",
        value: formatBRL(receitaTotal),
        change: "+0% vs mês anterior",
        icon: DollarSign,
        trend: "up",
      },
      {
        title: "Faturas Registradas",
        value: faturas.length.toString(),
        change: `Total de ${faturas.length} faturas`,
        icon: FileText,
        trend: "up",
      },
      {
        title: "Pendentes",
        value: "N/A",
        change: "Status não disponível",
        icon: Clock,
        trend: "neutral",
      },
      {
        title: "Despesas Totais",
        value: formatBRL(despesaTotal),
        change: "Total gasto",
        icon: TrendingUp,
        trend: "down",
      },
    ];
  }, [faturas]);

  // useMemo para processedRecentInvoices
  const processedRecentInvoices = useMemo(() => {
    if (!faturas) return [];
    return faturas.slice(0, 5).map((f) => {
      const nomeFatura = f.fatura || f.fatura2 || f.fatura3 || "Fatura";
      
      let dataFatura = "Sem data";
      if (f.data_criacao) {
          const dateObj = new Date(f.data_criacao);
          if (!isNaN(dateObj.getTime())) { // Verifica se a data é válida
              dataFatura = dateObj.toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
              });
          }
      }

      let valorTotal = 0;
      const todosExtratos = f.extratos?.flat(2) ?? [];
      todosExtratos.forEach((extrato) => {
        extrato?.transferencias?.forEach((t) => {
          valorTotal += t.valor;
        });
      });
      const statusFatura = "Pendente";
      return {
        id: f._id,
        company: nomeFatura,
        amount: valorTotal.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        date: dataFatura,
        status: statusFatura as "Pago" | "Pendente" | "Atrasado",
      };
    });
  }, [faturas]);

  return (
    <div className="p-8 space-y-8">
      
      {/* ***** 1. SEÇÃO DO HEADER RESTAURADA ***** */}
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
      {/* ***** FIM DA SEÇÃO 1 ***** */}


      {/* ***** 2. SEÇÃO METRICS GRID RESTAURADA ***** */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          // Mostra cartões de "Carregando..."
          Array.from({ length: 4 }).map((_, index) => (
            <Card
              key={index}
              className="p-6 bg-card border-border animate-pulse"
            >
              <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/3"></div>
            </Card>
          ))
        ) : (
          // Mostra os dados processados
          processedMetrics.map((metric) => {
            const Icon = metric.icon
            return (
              <Card key={metric.title} className="p-6 bg-card border-border">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-sm text-muted-foreground">
                    {metric.title}
                  </span>
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-foreground">
                    {metric.value}
                  </p>
                  <p
                    className={cn(
                      "text-sm flex items-center gap-1",
                      metric.trend === "up"
                        ? "text-primary"
                        : metric.trend === "down"
                        ? "text-red-500"
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
          })
        )}
      </div>
      {/* ***** FIM DA SEÇÃO 2 ***** */}


      {/* Seção de Gráficos (Como já estava) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Gráfico de Receita agora ocupa a linha inteira */}
        <Card className="lg:col-span-4 p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Receita vs Despesas
              </h3>
              <p className="text-sm text-muted-foreground">Últimos 6 meses</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
          <RevenueChart data={faturas} />
        </Card>

        {/* Gráfico de Categoria (Metade da linha) */}
        <Card className="lg:col-span-2 p-6 bg-card border-border">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              Distribuição por Categoria
            </h3>
            <p className="text-sm text-muted-foreground">Receita por categoria</p>
          </div>
          <CategoryChart data={faturas ?? []} />
        </Card>

        {/* NOVO GRÁFICO DE ORIGEM (Outra metade da linha) */}
        <Card className="lg:col-span-2 p-6 bg-card border-border">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              Distribuição por Tipo
            </h3>
            <p className="text-sm text-muted-foreground">
              Receita por tipo de transação
            </p>
          </div>
          <OriginChart data={faturas ?? []} />
        </Card>
      </div>


      {/* ***** 3. SEÇÃO RECENT INVOICES RESTAURADA ***** */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Faturas Recentes
            </h2>
            <p className="text-sm text-muted-foreground">
              Últimas transações registradas
            </p>
          </div>
          <Button variant="ghost" className="text-foreground hover:bg-card">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>

        <div className="space-y-4">
          {loading && <div>Carregando faturas...</div>}
          {error && <div className="text-red-500">Erro: {error}</div>}
          {!loading && !error && processedRecentInvoices.length === 0 && (
            <div>Nenhuma fatura encontrada.</div>
          )}

          {processedRecentInvoices.map((invoice, index) => (
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
                      <span className="text-base font-semibold text-foreground">
                        {invoice.company}
                      </span>
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium",
                          invoice.status === "Pago" &&
                            "bg-primary/20 text-primary",
                          invoice.status === "Pendente" &&
                            "bg-muted text-muted-foreground",
                          invoice.status === "Atrasado" &&
                            "bg-orange-900/30 text-orange-400",
                        )}
                      >
                        {invoice.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      ID: {invoice.id}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-foreground">
                    {invoice.amount}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {invoice.date}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      {/* ***** FIM DA SEÇÃO 3 ***** */}
      
    </div>
  )
}
