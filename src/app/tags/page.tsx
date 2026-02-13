import { getAllTags } from '@/lib/posts'
import Link from 'next/link'

export const revalidate = 60

export const metadata = {
  title: 'Todas as Tags | Bolha Dev',
  description: 'Explore todos os tópicos e tags do blog Bolha Dev.',
}

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

export default async function TagsPage() {
  const tags = await getAllTags()

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 flex items-center gap-2">
        <span className="w-10 h-0.5 bg-emerald-400 rounded" />
        Todas as Tags
      </h1>
      <p className="text-white/70 mb-8">
        Explore todos os tópicos abordados no blog. Clique em uma tag para ver os posts relacionados.
      </p>

      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog/tag/${tag}`}
              className="px-4 py-2 rounded-full text-sm font-medium bg-white/10 text-white/90 hover:bg-white/20 hover:text-white border border-white/10 hover:border-white/20 transition-all duration-200"
            >
              {denormalizeTag(tag)}
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-white/80 py-8">Nenhuma tag disponível no momento.</p>
      )}

      <div className="mt-8 pt-8 border-t border-white/10">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar para o blog
        </Link>
      </div>
    </div>
  )
}
