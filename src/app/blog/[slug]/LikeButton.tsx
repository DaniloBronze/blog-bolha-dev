// src/app/blog/[slug]/LikeButton.tsx
'use client'

import { FaHeart } from 'react-icons/fa'
import { useState } from 'react'
import { alertsMsg } from '@/utils/alerts'
import { getOrCreateFingerprint } from '@/utils/fingerprint'
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
      
      // Gera ou obtém o fingerprint único do usuário
      const fingerprint = getOrCreateFingerprint()
      
      const response = await fetch(`/api/posts/${postId}/likes`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fingerprint })
      })
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
      className="bg-white/10 hover:bg-white/20 text-white/90 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-colors disabled:opacity-50 text-xs sm:text-sm"
      title="Curtir este post"
      disabled={loading}
    >
      {loading ? (
        <span className="animate-spin inline-block w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full" />
      ) : (
        <div className="flex items-center gap-1 sm:gap-2">
          <FaHeart className="text-sm sm:text-lg" />
          <span className="text-xs sm:text-sm">{data?.count || 0}</span>
        </div>
      )}
    </button>
  )
}