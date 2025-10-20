"use client"

import { FileText, Download } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RevenueChart } from "./revenue-chart"
import { CategoryChart } from "./category-chart"

const invoices = [
  {
    id: "INV-2024-089",
    company: "Empresa Alpha",
    amount: "R$ 12.500",
    date: "15 Out 2025",
    status: "Pago",
  },
  {
    id: "INV-2024-088",
    company: "Beta Solutions",
    amount: "R$ 8.900",
    date: "12 Out 2025",
    status: "Pendente",
  },
  {
    id: "INV-2024-087",
    company: "Gamma Corp",
    amount: "R$ 15.200",
    date: "10 Out 2025",
    status: "Pago",
  },
]

export function FaturasContent() {
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
          {invoices.map((invoice) => (
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
