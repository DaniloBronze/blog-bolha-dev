'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaSave, FaTimes } from 'react-icons/fa'
import { alertsMsg } from '@/utils/alerts'
import ImageUpload from '@/components/ImageUpload'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import MDEditor from '@uiw/react-md-editor'

interface Post {
  title: string
  description: string
  content: string
  published: boolean
  publishedAt: Date | null
  tags: string[]
}

export default function EditPost({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [post, setPost] = useState<Post>({
    title: '',
    description: '',
    content: '',
    published: false,
    publishedAt: null,
    tags: []
  })

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${params.id}`)
        if (!response.ok) {
          throw new Error('Erro ao buscar post')
        }
        const data = await response.json()
        setPost({
          ...data,
          tags: typeof data.tags === 'string' ? JSON.parse(data.tags) : data.tags || [],
          publishedAt: data.publishedAt ? new Date(data.publishedAt) : null
        })
      } catch (error) {
        alertsMsg('error', 'Erro ao carregar post')
        router.push('/admin/dashboard')
      }
    }
    fetchPost()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/posts/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...post,
          publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null
        })
      })
      
      if (response.ok) {
        alertsMsg('success', 'Post atualizado com sucesso!')
        router.push('/admin/dashboard')
      }
    } catch (error) {
      alertsMsg('error', 'Erro ao atualizar post')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Editar Post</h1>
        <button
          onClick={() => router.push('/admin/dashboard')}
          className="text-white/70 hover:text-white transition-colors"
        >
          <FaTimes className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium">
            Título
          </label>
          <input
            id="title"
            type="text"
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            className="w-full bg-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium">
            Descrição
          </label>
          <textarea
            id="description"
            value={post.description}
            onChange={(e) => setPost({ ...post, description: e.target.value })}
            className="w-full bg-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[100px]"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            <input
              type="checkbox"
              checked={post.published}
              onChange={(e) => setPost({ ...post, published: e.target.checked })}
              className="mr-2"
            />
            Publicado
          </label>
        </div>

        <div className="space-y-2">
          <label htmlFor="publishedAt" className="block text-sm font-medium">
            Data de Publicação
          </label>
          <input
            id="publishedAt"
            type="datetime-local"
            value={post.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : ''}
            onChange={(e) => setPost({ ...post, publishedAt: new Date(e.target.value) })}
            className="w-full bg-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="publishedAt" className="block text-sm font-medium">
            Data de Publicação
          </label>
          <input
            id="publishedAt"
            type="datetime-local"
            value={post.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : ''}
            onChange={(e) => setPost({ ...post, publishedAt: new Date(e.target.value) })}
            className="w-full bg-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="content" className="block text-sm font-medium">
            Conteúdo
          </label>
          
          {/* Upload de Imagem */}
          <div className="mb-3">
            <ImageUpload 
              onImageUpload={(url) => {
                const currentContent = post.content || ''
                const imageMarkdown = `![Imagem](${url})`
                const newContent = imageMarkdown + (currentContent ? '\n\n' + currentContent : '')
                setPost({ ...post, content: newContent })
              }}
            />
          </div>
          
          <div data-color-mode="dark">
            <MDEditor
              value={post.content}
              onChange={(value) => setPost({ ...post, content: value || '' })}
              height={400}
              className="w-full bg-white/10 rounded-lg overflow-hidden"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="tags" className="block text-sm font-medium">
            Tags (separadas por vírgula)
          </label>
          <input
            id="tags"
            type="text"
            value={(post.tags || []).join(', ')}
            onChange={(e) => setPost({ ...post, tags: e.target.value.split(',').map(tag => tag.trim()) })}
            className="w-full bg-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-4">
          <button
            type="submit"
            className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FaSave className="w-5 h-5" />
            <span>Salvar Alterações</span>
          </button>
        </div>
      </form>
    </div>
  )
}