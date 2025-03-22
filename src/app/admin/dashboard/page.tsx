'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FaEdit, FaTrash } from 'react-icons/fa'

interface Post {
  id: string
  title: string
  slug: string
  published: boolean
  createdAt: string
  comments: { id: string }[]
  likes: { id: string }[]
}

export default function DashboardPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts')
        const data = await response.json()
        setPosts(data)
      } catch (error) {
        console.error('Failed to fetch posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const handleDelete = async (postId: string) => {
    if (confirm('Tem certeza que deseja excluir este post?')) {
      try {
        const response = await fetch(`/api/posts/${postId}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          setPosts((prevPosts: Post[]) => prevPosts.filter((post) => post.id !== postId))
        } else {
          console.error('Falha ao excluir o post')
        }
      } catch (error) {
        console.error('Erro ao excluir post:', error)
      }
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Posts</h1>
        <Link
          href="/admin/posts/new"
          className="px-4 py-2 bg-blue-600/30 hover:bg-blue-500/40 text-white rounded-md"
        >
          Novo Post
        </Link>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-left text-sm font-medium text-white/90">Título</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white/90">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white/90">Data</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-white/90">Interações</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-white/90">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-white/70">
                    Carregando posts...
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-white/70">
                    Nenhum post encontrado
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-white/5">
                    <td className="px-6 py-4">
                      <Link 
                        href={`/blog/${post.slug}`} 
                        className="text-white hover:text-blue-300 transition-colors"
                      >
                        {post.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${post.published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {post.published ? 'Publicado' : 'Rascunho'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white/70">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-white/70">
                      {post.comments?.length || 0} comentários • {post.likes?.length || 0} curtidas
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-4">
                        <Link
                          href={`/admin/posts/edit/${post.id}`}
                          className="text-white/70 hover:text-blue-300 transition-colors"
                        >
                          <FaEdit className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-white/70 hover:text-red-300 transition-colors"
                        >
                          <FaTrash className="w-5 h-5" />
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
