'use client'

import Link from 'next/link'
import { FaCalendar, FaClock } from 'react-icons/fa'
import { AdSense } from '@/components/AdSense'

/**
 * Converte tag normalizada (URL) para formato de exibição
 * Ex: "vender-na-shopee" → "Vender na Shopee"
 */
function denormalizeTag(normalizedTag: string): string {
  return normalizedTag
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

interface Post {
  slug: string
  title: string
  date: string
  tags: string[]
  readingTime: {
    minutes: number
    text: string
  }
  /** Se definido, usa este link em vez de /blog/[slug]. Ex.: /categoria/seo/post-slug */
  href?: string
}

interface SidebarProps {
  recentPosts: Post[]
  tags?: string[]
  currentTag?: string
  /** Posts para o bloco "Mais lidas" (estilo Ei NERD – fundo amarelo, números) */
  maisLidasPosts?: Post[]
}

export default function Sidebar({ recentPosts, tags, currentTag, maisLidasPosts }: SidebarProps) {
  return (
    <aside className="w-full lg:w-56 xl:w-64 mt-6 lg:mt-0 flex flex-col gap-4 sm:gap-6 lg:shrink-0">
      {maisLidasPosts && maisLidasPosts.length > 0 && (
        <div className="bg-amber-400 text-neutral-900 rounded-xl p-4 sm:p-5 border border-amber-500/50 shadow-lg shadow-amber-900/20">
          <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide mb-3">Mais lidas</h2>
          <ul className="space-y-3">
            {maisLidasPosts.map((post, i) => (
              <li key={post.slug}>
                <Link href={post.href ?? `/blog/${post.slug}`} className="flex gap-3 items-start group">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    {post.tags[0] && (
                      <span className="text-xs font-semibold uppercase text-neutral-600 block truncate">
                        {post.tags[0]}
                      </span>
                    )}
                    <p className="text-sm font-medium text-neutral-900 group-hover:underline line-clamp-2 break-words hyphens-auto">
                      {post.title}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR && (
        <div className="flex justify-center">
          <AdSense
            adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR}
            adFormat="rectangle"
            className="w-full"
          />
        </div>
      )}

      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/10 shadow-lg shadow-black/10">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Posts Recentes</h2>
        <div className="space-y-3 sm:space-y-4">
          {recentPosts.map((post) => (
            <div key={post.slug}>
              <Link
                href={post.href ?? `/blog/${post.slug}`}
                className="block hover:bg-white/10 rounded-lg p-2 sm:p-3 transition-colors group"
              >
                <h3 className="text-white/90 font-medium group-hover:text-blue-300 transition-colors text-sm sm:text-base leading-tight break-words hyphens-auto">
                  {post.title}
                </h3>
                <div className="flex items-center text-xs sm:text-sm text-white/60 mt-1">
                  <FaCalendar className="mr-1 sm:mr-2 flex-shrink-0" />
                  {new Date(post.date).toLocaleDateString('pt-BR')}
                </div>
                <div className="flex items-center text-xs sm:text-sm text-white/60 mt-1">
                  <FaClock className="mr-1 sm:mr-2 flex-shrink-0" />
                  {post.readingTime.text}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {tags && tags.length > 0 && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/10 shadow-lg shadow-black/10">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Tags Populares</h2>
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 12).map((tag) => (
              <Link
                key={tag}
                href={`/blog/tag/${tag}`}
                className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${
                  currentTag === tag
                    ? 'bg-blue-600/50 text-white'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                } transition-colors`}
              >
                {denormalizeTag(tag)}
              </Link>
            ))}
          </div>
          {tags.length > 12 && (
            <div className="mt-4 text-center">
              <Link
                href="/tags"
                className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Ver todas as tags
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      )}
    </aside>
  )
}

