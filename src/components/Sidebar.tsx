'use client'

import Link from 'next/link'
import { FaCalendar, FaClock } from 'react-icons/fa'
import { AdSense } from '@/components/AdSense'

interface Post {
  slug: string
  title: string
  date: string
  tags: string[]
  readingTime: {
    minutes: number
    text: string
  }
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
    <aside className="w-full lg:w-72 lg:ml-8 mt-6 lg:mt-0 flex flex-col gap-4 sm:gap-6">
      {maisLidasPosts && maisLidasPosts.length > 0 && (
        <div className="bg-amber-400 text-neutral-900 rounded-lg p-4 sm:p-5 border border-amber-500/50">
          <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide mb-3">Mais lidas</h2>
          <ul className="space-y-3">
            {maisLidasPosts.map((post, i) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="flex gap-3 items-start group">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    {post.tags[0] && (
                      <span className="text-xs font-semibold uppercase text-neutral-600">
                        {post.tags[0]}
                      </span>
                    )}
                    <p className="text-sm font-medium text-neutral-900 group-hover:underline line-clamp-2">
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

      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-white/10">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Posts Recentes</h2>
        <div className="space-y-3 sm:space-y-4">
          {recentPosts.map((post) => (
            <div key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="block hover:bg-white/10 rounded-lg p-2 sm:p-3 transition-colors"
              >
                <h3 className="text-white/90 font-medium hover:text-blue-300 transition-colors text-sm sm:text-base leading-tight">
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
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-white/10">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tag/${tag}`}
                className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${
                  currentTag === tag
                    ? 'bg-blue-600/50 text-white'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                } transition-colors`}
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}

