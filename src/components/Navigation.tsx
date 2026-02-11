'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

const PRODUTO_URL = process.env.NEXT_PUBLIC_PRODUTO_URL ?? 'https://pratuaqui.com.br'

export default function Navigation() {
  const pathname = usePathname()
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const { data: sessionData, status } = useSession()

  useEffect(() => {
    if (status !== 'loading') {
      setSession(sessionData)
      setLoading(false)
    }
  }, [sessionData, status])

  const navLink = (href: string, label: string) => {
    const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
    return (
      <Link
        href={href}
        className={`py-4 px-2 text-sm font-medium uppercase tracking-wide transition-colors ${
          isActive ? 'text-blue-400 border-b-2 border-blue-400' : 'text-white/90 hover:text-white'
        }`}
      >
        {label}
      </Link>
    )
  }

  return (
    <nav className="bg-black/40 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center py-3 px-3 rounded bg-blue-600 text-white font-bold text-sm uppercase tracking-wide hover:bg-blue-500 transition-colors"
            >
              Bolha Dev
            </Link>
            <div className="hidden sm:flex items-center gap-1">
              {navLink('/', 'Home')}
              {navLink('/blog', 'Blog')}
              {navLink('/sobre', 'Sobre')}
              {!loading && session && navLink('/admin/dashboard', 'Admin')}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={PRODUTO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center py-2 px-4 rounded bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition-colors"
            >
              Testar PraTuAqui
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
