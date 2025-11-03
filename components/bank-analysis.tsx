// Crie este novo arquivo em: components/bank-analysis.tsx
"use client"

import { useMemo } from "react"

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
  extratos?: ExtratoItem[][]
}
// --- FIM DOS TIPOS ---

const formatBRL = (val: number) =>
  val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

export function BankAnalysis({ data: faturas }: { data: Fatura[] }) {
  
  const processedData = useMemo(() => {
    if (!faturas) return []
    
    // Agora o Map guarda um objeto com receitas E despesas
    const bankMap = new Map<string, { receitas: number, despesas: number }>()

    faturas.forEach((f) => {
      f.extratos?.flat(2).forEach((extrato) => {
        if (!extrato || !extrato.banco) return
        
        const bankName = extrato.banco
        const current = bankMap.get(bankName) || { receitas: 0, despesas: 0 }

        extrato.transferencias?.forEach((t) => {
          if (t.valor > 0) {
            current.receitas += t.valor
          } else {
            current.despesas += Math.abs(t.valor)
          }
        })
        bankMap.set(bankName, current)
      })
    })

    // Encontra o maior valor (para a escala da barra de progresso)
    let maxReceita = 0
    let maxDespesa = 0
    bankMap.forEach(v => {
      if (v.receitas > maxReceita) maxReceita = v.receitas
      if (v.despesas > maxDespesa) maxDespesa = v.despesas
    })
    const maxGlobal = Math.max(maxReceita, maxDespesa)

    if (maxGlobal === 0) return []

    // Converte o Map para o formato do gráfico
    return Array.from(bankMap.entries()).map(([name, values]) => ({
      name,
      ...values,
      // Calcula a % da barra baseado no maior valor
      receitaPercent: (values.receitas / maxGlobal) * 100,
      despesaPercent: (values.despesas / maxGlobal) * 100,
    }))
    .sort((a, b) => (b.receitas + b.despesas) - (a.receitas + a.despesas)) // Ordena por volume
    
  }, [faturas])

  return (
    <div className="space-y-4">
      {processedData.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center">
          Sem dados de bancos para exibir.
        </p>
      ) : (
        processedData.map((item) => (
          <div key={item.name}>
            <span className="text-sm font-medium text-foreground">
              {item.name}
            </span>
            {/* Barra de Receitas */}
            <div className="flex items-center gap-2 text-xs text-green-500">
              <span className="w-12">Receita</span>
              <div className="h-2 w-full rounded-full bg-muted flex-1">
                <div
                  className="h-2 rounded-full bg-green-500"
                  style={{ width: `${item.receitaPercent}%` }}
                />
              </div>
              <span className="w-24 text-right">{formatBRL(item.receitas)}</span>
            </div>
            {/* Barra de Despesas */}
            <div className="flex items-center gap-2 text-xs text-red-500">
              <span className="w-12">Despesa</span>
              <div className="h-2 w-full rounded-full bg-muted flex-1">
                <div
                  className="h-2 rounded-full bg-red-500"
                  style={{ width: `${item.despesaPercent}%` }}
                />
              </div>
              <span className="w-24 text-right">{formatBRL(item.despesas)}</span>
            </div>
          </div>
        ))
      )}
    </div>
  )
}