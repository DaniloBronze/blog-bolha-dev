'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import SearchSidebar from '@/components/SearchSidebar'

const PRODUTO_URL = process.env.NEXT_PUBLIC_PRODUTO_URL ?? 'https://pratuaqui.com.br'

interface Category {
  id: number
  name: string
  slug: string
  description: string | null
}

export default function Navigation({ categories = [] }: { categories?: Category[] }) {
  const pathname = usePathname()
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const { data: sessionData, status } = useSession()

  useEffect(() => {
    if (status !== 'loading') {
      setSession(sessionData)
      setLoading(false)
    }
  }, [sessionData, status])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href)
  const isCategoryActive = (slug: string) => pathname.startsWith(`/categoria/${slug}`)

  const navLinkClass = (href: string) =>
    `block py-3 px-4 rounded-lg text-sm font-medium uppercase tracking-wide transition-colors ${
      isActive(href) ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-white/90 hover:bg-white/10 hover:text-white'
    }`

  return (
    <>
      <nav className="bg-black/50 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 shadow-lg shadow-black/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-6 sm:gap-8 h-18 sm:h-20 min-h-[4.5rem] sm:min-h-[5.5rem]">
            {/* Esquerda: logo + links */}
            <div className="flex items-center gap-8 lg:gap-10 flex-1 min-w-0">
              <Link
                href="/"
                className="flex items-center gap-2.5 py-2 px-3 rounded-lg  text-white font-bold text-sm uppercase tracking-wide hover:bg-blue-500 transition-colors shrink-0"
              >
                <img src="/icon.svg" alt="" className="h-8 w-8 rounded object-contain" width={50} height={50} />
                <span className="">Bolha Dev</span>
              </Link>

              {/* Desktop: links principais */}
              <div className="hidden md:flex items-center gap-2">
              <Link href="/" className={navLinkClass('/')}>
                Início
              </Link>

              {/* Dropdown Categorias */}
              <div
                className="relative"
                onMouseEnter={() => setCategoriesDropdownOpen(true)}
                onMouseLeave={() => setCategoriesDropdownOpen(false)}
              >
                <button
                  type="button"
                  className={`py-3 px-3 text-sm font-medium uppercase tracking-wide transition-colors rounded-lg ${
                    categories.some((c) => isCategoryActive(c.slug))
                      ? 'text-blue-400 bg-blue-600/10'
                      : 'text-white/90 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Categorias ▾
                </button>
                {categoriesDropdownOpen && categories.length > 0 && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-56 py-2 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/categoria/${cat.slug}`}
                        className={`block px-4 py-2.5 text-sm transition-colors ${
                          isCategoryActive(cat.slug) ? 'text-blue-400 bg-blue-600/10' : 'text-white/90 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {cat.name}
                      </Link>
                    ))}
                    <Link
                      href="/categorias"
                      className="block px-4 py-2.5 text-sm text-blue-400 hover:bg-blue-600/10 border-t border-white/10 mt-1 pt-2"
                    >
                      Ver todas →
                    </Link>
                  </div>
                )}
              </div>

              <Link href="/blog" className={navLinkClass('/blog')}>
                Blog
              </Link>
              <Link href="/categorias" className={navLinkClass('/categorias')}>
                Todas
              </Link>
              <Link href="/sobre" className={navLinkClass('/sobre')}>
                Sobre
              </Link>
              <a
                href={PRODUTO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-3 text-sm font-medium uppercase tracking-wide text-white/90 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                Contato
              </a>
              {!loading && session && (
                <Link href="/admin/dashboard" className={navLinkClass('/admin/dashboard')}>
                  Admin
                </Link>
              )}
              </div>
            </div>

            {/* Direita: lupa + CTA (só desktop) + Hamburger */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Ícone de lupa */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="p-2 sm:p-2.5 rounded-lg text-white/90 hover:bg-white/10 hover:text-white transition-colors"
                aria-label="Pesquisar"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              <a
                href={PRODUTO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center py-2 px-4 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition-colors shrink-0"
              >
                Testar PraTuAqui
              </a>
              <button
                type="button"
                onClick={() => setMobileOpen((o) => !o)}
                className="md:hidden p-2 rounded-lg text-white/90 hover:bg-white/10 hover:text-white transition-colors"
                aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
                aria-expanded={mobileOpen}
              >
                <span className="sr-only">{mobileOpen ? 'Fechar' : 'Menu'}</span>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  {mobileOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
        aria-hidden
      />

      {/* Mobile menu panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-gray-900 border-l border-white/10 shadow-2xl md:hidden transform transition-transform duration-300 ease-out ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
      >
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <img src="/icon.svg" alt="" className="h-8 w-8 rounded object-contain" width={32} height={32} />
              <span className="font-bold text-sm uppercase tracking-wide text-white">Bolha Dev</span>
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-lg text-white/90 hover:bg-white/10"
              aria-label="Fechar menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-4 space-y-1">
            <Link href="/" className={navLinkClass('/')} onClick={() => setMobileOpen(false)}>
              Início
            </Link>
            <Link href="/blog" className={navLinkClass('/blog')} onClick={() => setMobileOpen(false)}>
              Blog
            </Link>
            <Link href="/categorias" className={navLinkClass('/categorias')} onClick={() => setMobileOpen(false)}>
              Todas as categorias
            </Link>
            <Link href="/sobre" className={navLinkClass('/sobre')} onClick={() => setMobileOpen(false)}>
              Sobre
            </Link>
            <a
              href={PRODUTO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block py-3 px-4 rounded-lg text-sm font-medium text-white/90 hover:bg-white/10 hover:text-white"
            >
              Contato
            </a>
            {!loading && session && (
              <Link href="/admin/dashboard" className={navLinkClass('/admin/dashboard')} onClick={() => setMobileOpen(false)}>
                Admin
              </Link>
            )}

            {/* Categorias no mobile – em bloco destacado */}
            {categories.length > 0 && (
              <div className="pt-4 mt-4 border-t border-white/10">
                <p className="px-4 mb-2 text-xs font-semibold uppercase tracking-wider text-white/50">Categorias</p>
                <div className="grid grid-cols-1 gap-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/categoria/${cat.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className={`py-2.5 px-4 rounded-lg text-sm transition-colors ${
                        isCategoryActive(cat.slug) ? 'bg-blue-600/20 text-blue-400' : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <a
              href={PRODUTO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition-colors"
            >
              Testar PraTuAqui
            </a>
          </div>
        </div>
      </div>

      {/* Search Sidebar */}
      <SearchSidebar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
