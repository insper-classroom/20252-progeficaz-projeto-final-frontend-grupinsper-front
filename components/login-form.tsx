"use client"

import type React from "react"
import { useState } from "react" // Importado
import Link from "next/link"
import { useRouter } from "next/navigation" // Importado
import { ArrowLeft, Zap, Mail, Lock, Loader2 } from "lucide-react" // Importado Loader2
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { loginUser } from "@/lib/api" // Importa a função de login da API

export function LoginForm() {
  const router = useRouter() // Hook para redirecionamento
  
  // Estados do formulário
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  // const [rememberMe, setRememberMe] = useState(false) // Removido (ver nota abaixo)

  // Estados de controle da API
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // 1. Chama a API de login
      // A função 'loginUser' salva o token (cookie) e o usuário (localStorage)
      const data = await loginUser({ email, password })

      // 2. SÓ PRECISA CHECAR O SUCESSO E O USUÁRIO
      if (data.success && data.user) {
        // 3. Redireciona para o dashboard
        router.push("/dashboard")
      } else {
        // Isso pode acontecer se data.success for false
        setError(data.message || "Resposta inesperada do servidor.")
      }
      
    } catch (err: any) {
      // Pega a mensagem de erro do backend (ex: "Email ou senha inválidos")
      setError(err.response?.data?.message || err.message || "Erro ao fazer login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Back button */}
      <div className="p-8">
        <Link href="/" className="inline-flex items-center gap-2 text-foreground hover:text-cyan-400 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Voltar</span>
        </Link>
      </div>

      {/* Login form */}
      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">
          {/* Logo and heading */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-500/20 mb-6">
              <Zap className="w-8 h-8 text-foreground" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Bem-vindo</h1>
            <p className="text-muted-foreground">Entre para acessar sua conta</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading} // Adicionado
                  className="pl-10 bg-background/50 border-2 border-foreground/40 focus:border-cyan-500 focus:ring-cyan-500/40"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading} // Adicionado
                  className="pl-10 bg-background/50 border-2 border-foreground/40 focus:border-cyan-500 focus:ring-cyan-500/40"
                />
              </div>
            </div>

            {/* Remember me and forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  // checked={rememberMe} // Removido
                  // onCheckedChange={(checked) => setRememberMe(checked as boolean)} // Removido
                  className="border-2 border-foreground/50 focus-visible:ring-cyan-500/40 hover:border-cyan-500/70"
                />
                <Label htmlFor="remember" className="text-sm cursor-pointer">
                  Lembrar-me
                </Label>
              </div>
              <Link
                href="/recuperar-senha"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Esqueceu a senha?
              </Link>
            </div>
            
            {/* Mensagem de Erro */}
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              disabled={isLoading} // Adicionado
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-6 transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/20"
            >
              {/* Lógica de Loading */}
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                "Entrar"
              )}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-foreground/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-background text-muted-foreground">ou</span>
              </div>
            </div>

            {/* Sign up link */}
            <div className="text-center">
              <span className="text-muted-foreground">Não tem uma conta? </span>
              <Link href="/cadastro" className="text-foreground font-medium hover:text-cyan-400 transition-colors">
                Cadastre-se
              </Link>
            </div>
          </form>

          {/* Security message */}
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Lock className="w-4 h-4" />
            <span>Conexão segura e criptografada</span>
          </div>
        </div>
      </div>
    </div>
  )
}