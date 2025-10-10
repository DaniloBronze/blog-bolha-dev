// src/app/blog/[slug]/LikeButton.tsx
'use client'

import { FaHeart } from 'react-icons/fa'
import { useState } from 'react'
import { alertsMsg } from '@/utils/alerts'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function LikeButton({ postId }: { postId: string }) {
  const [loading, setLoading] = useState(false)
  const { data, mutate } = useSWR(`/api/posts/${postId}/likes`, fetcher, {
    refreshInterval: 5000 * 60 // Atualiza a cada 1min
  })

  const handleLike = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/posts/${postId}/likes`, { method: 'POST' })
      const data = await response.json()
      
      if (data.liked) {
        alertsMsg('success', 'Obrigado pelo like!')
      } else {
        alertsMsg('info', 'Like removido')
      }
      mutate() // Força a revalidação dos dados de 1min
    } catch {
      alertsMsg('error', 'Erro ao registrar like. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLike}
      className="bg-white/10 hover:bg-white/20 text-white/90 px-3 py-1 rounded-lg transition-colors disabled:opacity-50"
      title="Curtir este post"
      disabled={loading}
    >
      {loading ? (
        <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
      ) : (
        <div className="flex items-center gap-2">
          <FaHeart className="text-lg" />
          <span className="text-sm">{data?.count || 0}</span>
        </div>
      )}
    </button>
  )
}