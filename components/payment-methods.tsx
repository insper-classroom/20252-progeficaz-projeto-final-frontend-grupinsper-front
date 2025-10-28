// Em components/payment-methods.tsx
"use client"

import { useMemo } from "react"

// --- DEFINIÇÃO DE TIPOS ---
// ... (Copie os tipos Fatura, ExtratoItem, Transferencia)
type Transferencia = { valor: number; data: string; origem: string; categoria: string }
type ExtratoItem = { banco: string; _id: string; transferencias: Transferencia[] }
type Fatura = { _id: string; extratos?: ExtratoItem[][] }
// --- FIM DOS TIPOS ---

// ***** PALETAS DE CORES DIFERENTES *****
const COLORS_RECEBIDOS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"]
const COLORS_FEITOS = ["var(--chart-3)", "var(--chart-4)", "var(--chart-5)", "var(--chart-1)"]

// ***** ACEITA 'view' COMO PROP *****
export function PaymentMethods({ data: faturas, view }: { data: Fatura[], view: 'recebidos' | 'feitos' }) {
  
  const processedData = useMemo(() => {
    if (!faturas || faturas.length === 0) return []

    const originMap = new Map<string, number>()
    let totalValue = 0

    // ***** LÓGICA DE FILTRO DINÂMICA *****
    const filterCondition = (t: Transferencia) => 
      view === 'recebidos' ? t.valor > 0 : t.valor < 0
    
    faturas.forEach((f) => {
      f.extratos?.flat(2).forEach((extrato) => {
        extrato?.transferencias?.forEach((t) => {
          if (t && filterCondition(t)) { // <-- FILTRO APLICADO
            const origin = t.origem || "Outro"
            const currentTotal = originMap.get(origin) || 0
            const value = view === 'recebidos' ? t.valor : Math.abs(t.valor)
            
            originMap.set(origin, currentTotal + value)
            totalValue += value
          }
        })
      })
    })
    
    if (totalValue === 0) return []

    // ***** PALETA DE COR DINÂMICA *****
    const palette = view === 'recebidos' ? COLORS_RECEBIDOS : COLORS_FEITOS

    return Array.from(originMap.entries())
      .map(([name, value], index) => ({
        name,
        value,
        percentage: Math.round((value / totalValue) * 100),
        color: palette[index % palette.length], // <-- USA A PALETA DINÂMICA
      }))
      .sort((a, b) => b.value - a.value)
      
  }, [faturas, view]) // <-- 'view' ADICIONADO À DEPENDÊNCIA

  const formatBRL = (val: number) =>
    val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

  return (
    <div className="space-y-4">
      {processedData.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center">
          Nenhum método de pagamento encontrado.
        </p>
      ) : (
        processedData.map((item) => (
          <div key={item.name} className="space-y-1">
            {/* ... (Renderização das barras, sem mudanças) ... */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{item.name}</span>
              <span className="font-medium text-foreground">
                {formatBRL(item.value)} ({item.percentage}%)
              </span>
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
        ))
      )}
    </div>
  )
}