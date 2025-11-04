import { DashboardLayout } from "@/components/dashboard-layout"
import type { ReactNode } from "react"

export default function LayoutParaDashboard({ children }: { children: ReactNode }) {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  )
}
