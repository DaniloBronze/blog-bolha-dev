import { getCategoryBySlug } from '@/lib/categories'
import { getPostsByCategorySlug, getAllTags, getMostLikedPosts } from '@/lib/posts'
import Sidebar from '@/components/Sidebar'
import PostCard from '@/components/PostCard'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const revalidate = 60

const POSTS_PER_PAGE = 12

interface Props {
  params: { slug: string }
  searchParams: { page?: string }
}

export async function generateStaticParams() {
  const { getCategoryIdsForSitemap } = await import('@/lib/categories')
  const categories = await getCategoryIdsForSitemap()
  return categories.map((c) => ({ slug: c.slug }))
}

export default async function CategoriaPage({ params, searchParams }: Props) {
  const { slug } = params
  const page = Math.max(1, parseInt(searchParams.page ?? '1', 10) || 1)

  const [category, { posts, total }, allTags, maisLidasPosts] = await Promise.all([
    getCategoryBySlug(slug),
    getPostsByCategorySlug(slug, { page, limit: POSTS_PER_PAGE }),
    getAllTags(),
    getMostLikedPosts(3),
  ])

  if (!category) notFound()

  const totalPages = Math.ceil(total / POSTS_PER_PAGE)
  const hasNext = page < totalPages
  const hasPrev = page > 1

  const maisLidas = maisLidasPosts.length > 0 ? maisLidasPosts : posts.slice(0, 3)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row lg:gap-16 lg:items-start">
        <main className="flex-1 min-w-0 lg:max-w-[calc(100%-18rem)] xl:max-w-[calc(100%-20rem)]">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="w-10 h-0.5 bg-blue-400 rounded" />
            {category.name}
          </h1>
          {category.description && (
            <p className="text-white/70 text-sm mb-6">{category.description}</p>
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            {posts.map((post, i) => (
              <PostCard
                key={post.slug}
                slug={post.slug}
                title={post.title}
                description={post.description}
                tags={post.tags}
                date={post.date}
                readingTime={post.readingTime.text}
                coverImage={post.coverImage}
                tagColorIndex={i % 3}
                href={post.categorySlug ? `/categoria/${post.categorySlug}/${post.slug}` : undefined}
              />
            ))}
          </div>

          {posts.length === 0 && (
            <p className="text-white/80 py-8">Nenhum post nesta categoria ainda.</p>
          )}

          {totalPages > 1 && (
            <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Paginação">
              {hasPrev && (
                <Link
                  href={page === 2 ? `/categoria/${slug}` : `/categoria/${slug}?page=${page - 1}`}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  ← Anterior
                </Link>
              )}
              <span className="text-white/70 px-4">
                Página {page} de {totalPages}
              </span>
              {hasNext && (
                <Link
                  href={`/categoria/${slug}?page=${page + 1}`}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  Próxima →
                </Link>
              )}
            </nav>
          )}
        </main>

        <Sidebar
          recentPosts={posts.slice(0, 5)}
          tags={allTags}
          maisLidasPosts={maisLidas}
        />
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: Props) {
  const category = await getCategoryBySlug(params.slug)
  if (!category) return { title: 'Categoria não encontrada' }

  return {
    title: `${category.name} | Bolha Dev`,
    description: category.description ?? `Posts sobre ${category.name} no blog Bolha Dev.`,
  }
}
