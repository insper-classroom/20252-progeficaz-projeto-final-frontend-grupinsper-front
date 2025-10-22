"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Upload, FileText, X, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface NovaFaturaModalProps {
  children: React.ReactNode
}

export function NovaFaturaModal({ children }: NovaFaturaModalProps) {
  const [open, setOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const isPdfFile = (file: File) => {
    return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && isPdfFile(file)) {
      setSelectedFile(file)
      setErrorMessage(null)
    } else if (file) {
      setErrorMessage("Por favor, selecione apenas arquivos PDF")
    }
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
    const file = e.dataTransfer.files?.[0]
    if (file && isPdfFile(file)) {
      setSelectedFile(file)
      setErrorMessage(null)
    } else if (file) {
      setErrorMessage("Por favor, arraste apenas arquivos PDF")
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setErrorMessage(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedFile) {
      console.log("[v0] Uploading file:", selectedFile.name)
      // Handle file upload
      setOpen(false)
      setSelectedFile(null)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">Novo Extrato</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {errorMessage && (
            <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          <div
            className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : selectedFile
                  ? "border-primary/50 bg-primary/5"
                  : "border-border hover:border-primary/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {!selectedFile ? (
              <>
                <div className="flex flex-col items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-4">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-foreground">Arraste e solte seu extrao aqui</p>
                    <p className="text-sm text-muted-foreground">ou clique para selecionar um arquivo</p>
                  </div>
                  <p className="text-xs text-muted-foreground">PDF (máx. 10MB)</p>
                </div>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </>
            ) : (
              <div className="flex items-center justify-between gap-4 p-4 bg-background rounded-lg">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="rounded-lg bg-primary/10 p-2 flex-shrink-0">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="font-medium text-foreground truncate">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleRemoveFile}
                  className="flex-shrink-0 hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false)
                setSelectedFile(null)
                setErrorMessage(null)
              }}
              className="border-border"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!selectedFile}
              className="bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
            >
              Enviar Extrato
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
