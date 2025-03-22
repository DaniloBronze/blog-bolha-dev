'use client'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function LikeCounter({ postId }: { postId: string }) {
  const { data: likesData } = useSWR(`/api/posts/${postId}/likes`, fetcher, {
    refreshInterval: 1000
  })

  return (
    <span className="text-white/70 text-sm">{likesData?.count || 0} curtidas</span>
  )
}