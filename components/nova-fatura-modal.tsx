"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Upload, FileText, X, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { uploadExtratos, getStoredUser } from "@/lib/api" // ✅ ajuste o caminho conforme a estrutura do seu projeto

interface NovaFaturaModalProps {
  children: React.ReactNode
}

export function NovaFaturaModal({ children }: NovaFaturaModalProps) {
  const [open, setOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  // Filtra PDFs
  const isPdfFile = (file: File) =>
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const pdfFiles = files.filter(isPdfFile)

    if (pdfFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...pdfFiles])
      setErrorMessage(null)
    }
    if (pdfFiles.length < files.length) {
      setErrorMessage("Alguns arquivos foram ignorados. Apenas PDFs são aceitos.")
    }

    e.target.value = ""
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    const pdfFiles = files.filter(isPdfFile)

    if (pdfFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...pdfFiles])
      setErrorMessage(null)
    }
    if (pdfFiles.length < files.length) {
      setErrorMessage("Alguns arquivos foram ignorados. Apenas PDFs são aceitos.")
    }
  }

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    setErrorMessage(null)
  }

  const handleRemoveAll = () => {
    setSelectedFiles([])
    setErrorMessage(null)
  }

  // ✅ Novo handleSubmit com integração real com o backend
  const handleSubmit = async () => {
    if (selectedFiles.length === 0) return

    const user = getStoredUser()
    if (!user || !user._id) {
      setErrorMessage("Usuário não autenticado. Faça login novamente.")
      return
    }

    try {
      setUploading(true)
      setErrorMessage(null)

      console.log(`📤 Enviando ${selectedFiles.length} arquivo(s) para o backend...`)

      // ⚙️ Troque essa linha conforme o modo de teste ou real:
      // 👉 modo teste (sem custo):
      // const res = await uploadExtratos("test-upload", selectedFiles)
      // 👉 modo real (envia pro LlamaParse):
      const res = await uploadExtratos(user._id, selectedFiles)

      console.log("✅ Upload concluído:", res)
      alert("Extratos enviados com sucesso!")

      setOpen(false)
      setSelectedFiles([])
    } catch (err: any) {
      console.error("❌ Erro no upload:", err)
      setErrorMessage("Erro ao enviar os extratos. Verifique sua conexão ou tente novamente.")
    } finally {
      setUploading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-card border-border max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            Novo Extrato{" "}
            {selectedFiles.length > 0 &&
              `(${selectedFiles.length} arquivo${selectedFiles.length > 1 ? "s" : ""})`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4 flex-1 overflow-hidden flex flex-col">
          {errorMessage && (
            <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {/* Área de arrastar/selecionar arquivos */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : selectedFiles.length > 0
                ? "border-primary/50 bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-primary/10 p-4">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium text-foreground">
                  {selectedFiles.length > 0
                    ? "Adicionar mais extratos"
                    : "Arraste e solte seus extratos aqui"}
                </p>
                <p className="text-sm text-muted-foreground">ou clique para selecionar arquivos</p>
              </div>
              <p className="text-xs text-muted-foreground">PDF • Múltiplos arquivos permitidos</p>
            </div>
            <input
              type="file"
              accept=".pdf"
              multiple
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading}
            />
          </div>

          {/* Lista de arquivos selecionados */}
          {selectedFiles.length > 0 && (
            <div
              className="space-y-3 flex-1 overflow-y-auto pr-2"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(6, 182, 212, 0.3) transparent",
              }}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">
                  Arquivos selecionados • Total: {formatFileSize(totalSize)}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveAll}
                  className="text-muted-foreground hover:text-destructive h-8"
                  disabled={uploading}
                >
                  Limpar todos
                </Button>
              </div>

              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between gap-4 p-3 bg-background rounded-lg border border-border"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="rounded-lg bg-primary/10 p-2 flex-shrink-0">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="font-medium text-foreground truncate text-sm">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveFile(index)}
                      className="flex-shrink-0 hover:bg-destructive/10 hover:text-destructive h-8 w-8"
                      disabled={uploading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botões de ação */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false)
                setSelectedFiles([])
                setErrorMessage(null)
              }}
              className="border-border"
              disabled={uploading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={selectedFiles.length === 0 || uploading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
            >
              {uploading
                ? "Enviando..."
                : `Enviar${selectedFiles.length > 0 ? ` (${selectedFiles.length})` : ""}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
