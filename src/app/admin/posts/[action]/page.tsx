'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { FaSave, FaClock, FaTags } from 'react-icons/fa'
import ImageUpload from '@/components/ImageUpload'

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
)

interface PostFormData {
  title: string
  description: string
  content: string
  tags: string[]
  published: boolean
  publishedAt: string
}

export default function PostEditorPage({
  params,
}: {
  params: { action: string }
}) {
  const router = useRouter()
  const isEdit = params.action !== 'new'
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    description: '',
    content: '',
    tags: [],
    published: false,
    publishedAt: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    if (isEdit) {
      // TODO: Fetch post data if editing
    }
  }, [isEdit])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/posts', {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          slug: formData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, ''),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save post')
      }

      router.push('/admin/dashboard')
    } catch (error) {
      console.error('Error saving post:', error)
      // TODO: Show error message
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white/70">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">
        {isEdit ? 'Editar Post' : 'Novo Post'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/10 p-6">
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-white/90 mb-1">
                Título
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-white/90 mb-1">
                Descrição
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-1">
                Conteúdo
              </label>
              
              {/* Upload de Imagem */}
              <div className="mb-3">
                <ImageUpload 
                  onImageUpload={(url) => {
                    const currentContent = formData.content || ''
                    const imageMarkdown = `![Imagem](${url})`
                    const newContent = imageMarkdown + (currentContent ? '\n\n' + currentContent : '')
                    setFormData({ ...formData, content: newContent })
                  }}
                />
              </div>
              
              <div data-color-mode="dark">
                <MDEditor
                  value={formData.content}
                  onChange={(value) => setFormData({ ...formData, content: value || '' })}
                  height={400}
                  className="!bg-white/5 border !border-white/10 rounded-md overflow-hidden"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
                <label htmlFor="tags" className="block text-sm font-medium text-white/90 mb-1">
                  Tags
                </label>
              <div className="flex items-center space-x-2">
                <FaTags className="text-white/50" />
                <input
                  type="text"
                  id="tags"
                  placeholder="Separe as tags com vírgula"
                  value={formData.tags.join(', ')}
                  onChange={(e) => {
                    const tagsValue = e.target.value
                    const tagsArray = tagsValue ? tagsValue.split(',').map(tag => tag.trim()) : []
                    setFormData({
                      ...formData,
                      tags: tagsArray
                    })
                  }}
                  onBlur={(e) => {
                    const tagsValue = e.target.value
                    const tagsArray = tagsValue ? tagsValue.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : []
                    setFormData({
                      ...formData,
                      tags: tagsArray
                    })
                  }}
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Publication Settings */}
            <div className="flex items-center space-x-6 pt-4 border-t border-white/10">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="h-4 w-4 rounded border-white/10 bg-white/5 text-blue-500 focus:ring-blue-500"
                />
                <label htmlFor="published" className="ml-2 text-sm text-white/90">
                  Publicar
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <FaClock className="text-white/50" />
                <input
                  type="date"
                  value={formData.publishedAt}
                  onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                  className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600/30 text-white rounded-lg hover:bg-blue-500/40 transition-colors backdrop-blur-sm border border-blue-400/30 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaSave className="mr-2" />
            {saving ? 'Salvando...' : 'Salvar Post'}
          </button>
        </div>
      </form>
    </div>
  )
}
