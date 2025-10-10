'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

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

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div className="flex items-center py-4">
              <Link href="/" className="text-2xl font-bold text-white hover:text-blue-300">
                Bolha Dev
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className={`py-4 px-2 ${
                pathname === '/'
                  ? 'text-blue-300 border-b-2 border-blue-300'
                  : 'text-white hover:text-blue-300'
              }`}
            >
              Home
            </Link>
            <Link
              href="/blog"
              className={`py-4 px-2 ${
                pathname.startsWith('/blog')
                  ? 'text-blue-300 border-b-2 border-blue-300'
                  : 'text-white hover:text-blue-300'
              }`}
            >
              Blog
            </Link>
            <Link
              href="/sobre"
              className={`py-4 px-2 ${
                pathname.startsWith('/sobre')
                  ? 'text-blue-300 border-b-2 border-blue-300'
                  : 'text-white hover:text-blue-300'
              }`}
            >
              Sobre
            </Link>
            {!loading && session && (
              <Link
                href="/admin/dashboard"
                className={`py-4 px-2 ${
                  pathname.startsWith('/admin')
                    ? 'text-blue-300 border-b-2 border-blue-300'
                    : 'text-white hover:text-blue-300'
                }`}
              >
                Admin
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
