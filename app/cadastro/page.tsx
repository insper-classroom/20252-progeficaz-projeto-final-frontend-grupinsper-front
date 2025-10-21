import { SignupForm } from "@/components/signup-form"

export default function CadastroPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-1/4 top-1/4 w-[800px] h-[800px] bg-rose-500/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        <SignupForm />
      </div>
    </div>
  )
}
