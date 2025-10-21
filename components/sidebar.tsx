"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, FileText, CreditCard, Calendar, LogOut, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    name: "Faturas",
    href: "/faturas",
    icon: FileText,
  },
  {
    name: "Pagamentos",
    href: "/pagamentos",
    icon: CreditCard,
  },
  {
    name: "Agenda",
    href: "/agenda",
    icon: Calendar,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-[#0f0f0f] border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Zap className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-semibold text-foreground">InvoiceFlow</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-border">
        <button className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm text-muted-foreground hover:bg-secondary hover:text-foreground w-full">
          <LogOut className="w-5 h-5" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  )
}
