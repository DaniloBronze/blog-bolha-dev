'use client'

import Link from 'next/link'
import { FaCalendar, FaClock } from 'react-icons/fa'

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
}

export default function Sidebar({ recentPosts, tags, currentTag }: SidebarProps) {
  return (
    <aside className="w-full lg:w-64 lg:ml-8 mt-6 lg:mt-0">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-white/10">
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
