"use client"

import type { ReactNode } from "react"
import { useState } from "react" // Importamos o useState
import { Sidebar } from "./sidebar"
import { Button } from "@/components/ui/button" // Provavelmente você já tem
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet" // Essencial para o menu mobile
import { Menu, Zap } from "lucide-react" // Ícones para o botão e logo

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  // Estado para controlar o menu mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    // Div principal que envolve tudo
    <div className="flex min-h-screen w-full flex-col bg-background">
      
      {/* Sidebar para Desktop: 
        - 'hidden' (escondida por padrão)
        - 'md:flex' (visível como 'flex' a partir do breakpoint 'md' - medium/desktop)
        - 'fixed' e 'h-full' para mantê-la fixa à esquerda
      */}
      <aside className="hidden md:flex h-full w-64 flex-col fixed inset-y-0 z-10">
        <Sidebar onLinkClick={() => {}} /> {/* Passa prop vazia, não precisa fechar no desktop */}
      </aside>

      {/* Conteúdo Principal + Header Mobile */}
      {/* - 'md:pl-64' adiciona um padding à esquerda em telas de desktop
          para não ficar atrás da sidebar fixa (pl-64 = w-64 da sidebar)
      */}
      <div className="flex flex-col md:pl-64">
        
        {/* Header Mobile: Visível apenas em mobile ('md:hidden') */}
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 sticky top-0 z-20 md:hidden">
          
          {/* Botão Hambúrguer que usa o <Sheet> */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir/fechar menu de navegação</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0 w-64">
              {/* Re-utilizamos o seu componente Sidebar dentro do menu deslizante.
                Passamos a função para fechar o menu quando um link for clicado.
              */}
              <Sidebar onLinkClick={() => setIsMobileMenuOpen(false)} />
            </SheetContent>
          </Sheet>

          {/* Logo no Header Mobile (opcional, mas melhora a UI) */}
          <div className="flex items-center gap-2 font-semibold">
            <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="">InvoiceFlow</span>
          </div>
        </header>

        {/* Conteúdo Principal (main) 
          - Adicionamos padding (p-4, sm:p-6) para o conteúdo não colar nas bordas
        */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
