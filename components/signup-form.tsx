"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, User, Phone, FileText, Mail, Lock, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { registerUser } from "@/lib/api" // Importa a função da API

// O nome da função deve ser SignupForm
export function SignupForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    password: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // 1. Chama a API de registro
      // Lembre-se de remover o @jwt_required() da rota POST /usuarios no backend
      await registerUser(formData)
      
      // 2. Redireciona para o login
      alert("Cadastro realizado com sucesso! Faça seu login.")
      router.push("/login")

    } catch (err: any) {
      // Pega a mensagem de erro do backend (ex: "Email já cadastrado")
      setError(err.response?.data?.message || err.message || "Erro ao cadastrar")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-8">
        <Link href="/login" className="inline-flex items-center gap-2 text-foreground hover:text-cyan-400 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Voltar para Login</span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Crie sua conta</h1>
            <p className="text-muted-foreground">Preencha os dados para se cadastrar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campos: name, email, phone, cpf, password */}
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input id="name" placeholder="Seu nome" required disabled={isLoading} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="seu@email.com" required disabled={isLoading} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" type="tel" placeholder="(11) 99999-9999" required disabled={isLoading} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input id="cpf" placeholder="000.000.000-00" required disabled={isLoading} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" required disabled={isLoading} onChange={handleChange} />
            </div>
            
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <Button type="submit" disabled={isLoading} className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-6">
              {isLoading ? <Loader2 className="animate-spin" /> : "Cadastrar"}
            </Button>
            
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Já tem uma conta? </span>
              <Link href="/login" className="text-foreground font-medium hover:text-cyan-400 transition-colors">
                Faça Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}