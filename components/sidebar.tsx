"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { BarChart3, FileText, CreditCard, Calendar, LogOut, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { logoutUser } from "@/lib/api"
import { toast } from "@/hooks/use-toast"
import { useState } from "react"

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
]

// --- INÍCIO DA MUDANÇA ---
// 1. Definimos a interface de Props
interface SidebarProps {
  onLinkClick: () => void
}

// 2. Recebemos 'onLinkClick' como prop
export function Sidebar({ onLinkClick }: SidebarProps) {
// --- FIM DA MUDANÇA ---

  const pathname = usePathname()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  async function handleLogout() {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    try {
      await logoutUser()
      toast({
        title: "Você saiu da sua conta",
        description: "Sessão encerrada com sucesso.",
      })
    } catch (err) {
      // Mesmo em erro, vamos redirecionar para login para garantir saída
      toast({
        title: "Não foi possível encerrar a sessão",
        description: "Tentaremos novamente quando você fizer login.",
      })
    } finally {
      setIsLoggingOut(false)
      // --- MUDANÇA ---
      // 3. Chamamos onLinkClick também no logout
      onLinkClick() 
      router.push("/login")
    }
  }

  return (
    // 'aside' não precisa mais das classes 'w-64' ou 'bg-[#0f0f0f]' etc,
    // pois o container pai ('aside' no desktop, 'SheetContent' no mobile) já cuida disso.
    // Adicionamos 'w-full h-full' para preencher o container onde ele for colocado.
    <aside className="w-full h-full bg-[#0f0f0f] border-r border-border flex flex-col">
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
              // --- MUDANÇA ---
              // 4. Adicionamos o 'onClick' para fechar o menu mobile
              onClick={onLinkClick} 
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
        <button
          onClick={handleLogout} // handleLogout já chama onLinkClick
          disabled={isLoggingOut}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm w-full",
            "text-muted-foreground hover:bg-secondary hover:text-foreground",
            isLoggingOut && "opacity-60 cursor-not-allowed"
          )}
        >
          <LogOut className="w-5 h-5" />
          <span>{isLoggingOut ? "Saindo..." : "Sair"}</span>
        </button>
      </div>
    </aside>
  )
}
