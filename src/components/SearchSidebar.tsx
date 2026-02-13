'use client'

import Link from 'next/link'
import { useEffect, useState, useCallback, useRef } from 'react'

interface PostItem {
  slug: string
  title: string
  description?: string
  categorySlug?: string | null
}

interface SearchSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchSidebar({ isOpen, onClose }: SearchSidebarProps) {
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<PostItem[]>([])
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [trending, setTrending] = useState<PostItem[]>([])
  const [trendingLoaded, setTrendingLoaded] = useState(false)
  
  // Ref para controlar AbortController e evitar memory leaks
  const abortControllerRef = useRef<AbortController | null>(null)

  // Fetch posts em alta (carregado uma vez ao abrir)
  const fetchTrending = useCallback(async () => {
    if (trendingLoaded) return
    try {
      const res = await fetch('/api/recent-posts')
      if (res.ok) {
        const data = await res.json()
        setTrending(data)
      }
    } catch (err) {
      console.error('Erro ao carregar posts em alta:', err)
    } finally {
      setTrendingLoaded(true)
    }
  }, [trendingLoaded])

  // Carrega trending ao abrir sidebar
  useEffect(() => {
    if (!isOpen) {
      setTrendingLoaded(false)
      return
    }
    fetchTrending()
  }, [isOpen, fetchTrending])

  // Busca com debounce (300ms) + AbortController para cancelar requisições anteriores
  useEffect(() => {
    if (!isOpen) return

    // Limpa estados ao fechar
    if (!isOpen) {
      setQuery('')
      setSearchResults([])
      setSearching(false)
      setError(null)
      return
    }

    const q = query.trim()

    // Não busca com menos de 3 caracteres
    if (q.length < 3) {
      setSearchResults([])
      setSearching(false)
      setError(null)
      return
    }

    // Debounce: aguarda 300ms após última tecla
    const debounceTimer = setTimeout(() => {
      // Cancela requisição anterior (se existir)
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      // Cria novo AbortController para esta requisição
      const controller = new AbortController()
      abortControllerRef.current = controller

      setSearching(true)
      setError(null)

      fetch(`/api/search?q=${encodeURIComponent(q)}`, {
        signal: controller.signal, // Permite cancelamento
      })
        .then((res) => {
          if (!res.ok) throw new Error('Erro ao buscar')
          return res.json()
        })
        .then((data) => {
          // Apenas atualiza se não foi abortado
          if (!controller.signal.aborted) {
            setSearchResults(data.posts ?? [])
          }
        })
        .catch((err) => {
          // Ignora erro de abort (esperado ao cancelar)
          if (err.name === 'AbortError') return
          
          console.error('Erro na busca:', err)
          if (!controller.signal.aborted) {
            setError('Erro ao buscar. Tente novamente.')
            setSearchResults([])
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setSearching(false)
          }
        })
    }, 300)

    // Cleanup: cancela timer e requisição ao mudar query ou desmontar
    return () => {
      clearTimeout(debounceTimer)
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
        abortControllerRef.current = null
      }
    }
  }, [query, isOpen])

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const postHref = (p: PostItem) =>
    p.categorySlug ? `/categoria/${p.categorySlug}/${p.slug}` : `/blog/${p.slug}`

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden
      />
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-gray-900 border-l border-white/10 shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Pesquisar artigos"
      >
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 shrink-0">
          <h2 className="text-lg font-semibold text-white">Pesquisar</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-white/90 hover:bg-white/10 transition-colors"
            aria-label="Fechar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 sm:p-5 border-b border-white/10">
          <label htmlFor="search-sidebar-input" className="sr-only">
            Buscar artigos
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" aria-hidden>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              id="search-sidebar-input"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Digite para buscar..."
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus={isOpen}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {query.trim().length > 0 && query.trim().length < 3 ? (
            // Mensagem: digite pelo menos 3 caracteres
            <p className="text-white/40 text-sm">
              Digite pelo menos 3 caracteres para buscar...
            </p>
          ) : query.trim().length >= 3 ? (
            <div>
              {searching ? (
                // Loading state com animação
                <div className="flex items-center gap-2 text-white/50 text-sm">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Buscando...</span>
                </div>
              ) : error ? (
                // Estado de erro
                <div className="text-red-400/90 text-sm">
                  {error}
                </div>
              ) : searchResults.length === 0 ? (
                <p className="text-white/50 text-sm">
                  Nenhum post encontrado para &quot;{query.trim()}&quot;.
                </p>
              ) : (
                <ul className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-3">
                    {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''}
                  </p>
                  {searchResults.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={postHref(p)}
                        onClick={onClose}
                        className="block py-2.5 px-3 rounded-lg text-white/90 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        <span className="font-medium">{p.title}</span>
                        {p.description && (
                          <p className="text-sm text-white/50 line-clamp-1 mt-0.5">{p.description}</p>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-3">
                Posts em alta
              </p>
              {trending.length === 0 && !trendingLoaded ? (
                <p className="text-white/50 text-sm">Carregando...</p>
              ) : trending.length === 0 ? (
                <p className="text-white/50 text-sm">Nenhum post ainda.</p>
              ) : (
                <ul className="space-y-1">
                  {trending.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={postHref(p)}
                        onClick={onClose}
                        className="block py-2.5 px-3 rounded-lg text-white/90 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        {p.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
