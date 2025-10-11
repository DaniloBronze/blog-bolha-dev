'use client'

import { useState, useRef } from 'react'
import { FaImage, FaSpinner, FaCheck } from 'react-icons/fa'

interface ImageUploadProps {
  onImageUpload: (url: string) => void
  disabled?: boolean
}

export default function ImageUpload({ onImageUpload, disabled = false }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Verificar se é uma imagem
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.')
      return
    }

    // Verificar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Arquivo muito grande. Máximo 5MB.')
      return
    }

    setUploading(true)
    setUploadSuccess(false)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        setUploadSuccess(true)
        onImageUpload(result.url)
        
        // Reset success state after 2 seconds
        setTimeout(() => {
          setUploadSuccess(false)
        }, 2000)
      } else {
        console.error('Erro no upload:', result.error)
        alert(result.error || 'Erro no upload da imagem')
      }
    } catch (error) {
      console.error('Erro no upload:', error)
      alert('Erro ao fazer upload da imagem')
    } finally {
      setUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleClick = () => {
    if (!disabled && !uploading) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />
      
      <button
          type="button"
        onClick={handleClick}
        disabled={disabled || uploading}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
          ${disabled || uploading
            ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
          }
        `}
        title="Fazer upload de imagem"
      >
        {uploading ? (
          <>
            <FaSpinner className="animate-spin" />
            Enviando...
          </>
        ) : uploadSuccess ? (
          <>
            <FaCheck className="text-green-400" />
            Inserida!
          </>
        ) : (
          <>
            <FaImage />
            Upload de Imagem
          </>
        )}
      </button>
    </div>
  )
}
