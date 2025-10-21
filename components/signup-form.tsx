"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Zap, User, Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SignupForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement signup logic
    console.log("Signup data:", formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Removed CPF/Telefone/Endereço fields and formatters per request

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="fixed top-4 left-4 z-50">
        <Link href="/" className="inline-flex items-center gap-2 text-foreground hover:text-cyan-400 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Voltar</span>
        </Link>
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-500/20 mb-6">
              <Zap className="w-8 h-8 text-foreground" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2">Criar conta</h1>
            <p className="text-muted-foreground">Preencha os dados para começar</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-foreground">
              Nome completo
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="nome"
                name="nome"
                type="text"
                placeholder="Seu nome completo"
                value={formData.nome}
                onChange={handleChange}
                required
                className="pl-10 bg-background/50 border-2 border-foreground/40 focus:border-cyan-500 focus:ring-cyan-500/40 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="pl-10 bg-background/50 border-2 border-foreground/40 focus:border-cyan-500 focus:ring-cyan-500/40 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="senha" className="text-foreground">
              Senha
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="senha"
                name="senha"
                type="password"
                placeholder="••••••••"
                value={formData.senha}
                onChange={handleChange}
                required
                minLength={6}
                className="pl-10 bg-background/50 border-2 border-foreground/40 focus:border-cyan-500 focus:ring-cyan-500/40 transition-all"
              />
            </div>
          </div>


          <Button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-6 transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/20"
          >
            Criar conta
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-foreground/20" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-muted-foreground">ou</span>
            </div>
          </div>

          <div className="text-center">
            <span className="text-muted-foreground">Já tem uma conta? </span>
            <Link href="/login" className="text-foreground font-medium hover:text-cyan-400 transition-colors">
              Entrar
            </Link>
          </div>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Lock className="w-4 h-4" />
          <span>Conexão segura e criptografada</span>
        </div>
      </div>
    </div>
  )
}
