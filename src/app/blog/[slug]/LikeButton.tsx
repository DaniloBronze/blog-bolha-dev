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

  const hasLikes = data?.count > 0
  const isLiked = data?.liked

  return (
    <button
      onClick={handleLike}
      className={`
        group relative overflow-hidden
        ${isLiked 
          ? 'bg-red-500/20 hover:bg-red-500/30 border border-red-400/50' 
          : 'bg-white/10 hover:bg-white/20 border border-white/20'
        }
        ${hasLikes ? 'animate-pulse' : ''}
        text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl 
        transition-all duration-300 hover:scale-105 hover:shadow-lg
        disabled:opacity-50 disabled:cursor-not-allowed
        shadow-md hover:shadow-xl
      `}
      title={isLiked ? "Remover curtida" : "Curtir este post"}
      disabled={loading}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
          <span className="text-sm">Curtindo...</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <FaHeart 
            className={`text-lg transition-all duration-300 ${
              isLiked 
                ? 'text-red-400 animate-bounce' 
                : 'text-white group-hover:text-red-300'
            }`} 
          />
          <span className="text-sm font-medium">
            {data?.count || 0} {data?.count === 1 ? 'curtida' : 'curtidas'}
          </span>
        </div>
      )}
      
      {/* Efeito de brilho no hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
    </button>
  )
}