'use client'

import { useState, useEffect } from 'react'
import { FaCheck, FaTimes, FaTrash } from 'react-icons/fa'
import Link from 'next/link'

interface Comment {
  id: string
  content: string
  authorName: string
  authorEmail: string
  createdAt: string
  approved: boolean
  post: {
    title: string
    slug: string
  }
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchComments()
  }, [])

  const fetchComments = async () => {
    try {
      const response = await fetch('/api/comments')
      if (!response.ok) throw new Error('Failed to fetch comments')
      const data = await response.json()
      setComments(data)
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/api/comments/${id}/approve`, {
        method: 'PUT',
      })
      if (!response.ok) throw new Error('Failed to approve comment')
      
      setComments(comments.map(comment => 
        comment.id === id ? { ...comment, approved: true } : comment
      ))
    } catch (error) {
      console.error('Error approving comment:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este comentário?')) return

    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete comment')
      
      setComments(comments.filter(comment => comment.id !== id))
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Gerenciar Comentários</h1>

      <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-left text-sm font-medium text-white/90">Autor</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white/90">Comentário</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white/90">Post</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white/90">Data</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white/90">Status</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-white/90">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-white/70">
                    Carregando comentários...
                  </td>
                </tr>
              ) : comments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-white/70">
                    Nenhum comentário encontrado
                  </td>
                </tr>
              ) : (
                comments.map((comment) => (
                  <tr key={comment.id} className="hover:bg-white/5">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-white">{comment.authorName}</div>
                        <div className="text-white/50 text-sm">{comment.authorEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white/90 max-w-md truncate">
                        {comment.content}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/blog/${comment.post.slug}`}
                        className="text-blue-300 hover:text-blue-200 transition-colors"
                      >
                        {comment.post.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-white/70">
                      {new Date(comment.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        comment.approved 
                          ? 'bg-green-400/20 text-green-400' 
                          : 'bg-yellow-400/20 text-yellow-400'
                      }`}>
                        {comment.approved ? 'Aprovado' : 'Pendente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-3">
                        {!comment.approved && (
                          <button
                            onClick={() => handleApprove(comment.id)}
                            className="p-2 text-white/70 hover:text-green-400 transition-colors"
                            title="Aprovar"
                          >
                            <FaCheck className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="p-2 text-white/70 hover:text-red-400 transition-colors"
                          title="Excluir"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
