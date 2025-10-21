"use client"

const paymentMethods = [
  { method: "PIX", count: 45, percentage: 38, color: "var(--chart-1)" },
  { method: "Transferência", count: 32, percentage: 27, color: "var(--chart-2)" },
  { method: "Boleto", count: 28, percentage: 23, color: "var(--chart-3)" },
]

export function PaymentMethods() {
  return (
    <div className="space-y-4">
      {paymentMethods.map((method) => (
        <div key={method.method} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground font-medium">{method.method}</span>
            <span className="text-muted-foreground">
              {method.count} ({method.percentage}%)
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${method.percentage}%`,
                backgroundColor: method.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
