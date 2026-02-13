import { searchPosts, getAllTags, getMostLikedPosts, getRecentPosts } from '@/lib/posts'
import PostCard from '@/components/PostCard'
import Sidebar from '@/components/Sidebar'
import SearchForm from './SearchForm'

export const revalidate = 60

export const metadata = {
  title: 'Pesquisar',
  description: 'Pesquise artigos e posts do Bolha Dev.',
}

interface Props {
  searchParams: Promise<{ q?: string }>
}

export default async function BuscaPage({ searchParams }: Props) {
  const { q } = await searchParams
  const query = (q ?? '').trim()

  const [posts, tags, maisLidasPosts, recentPosts] = await Promise.all([
    query.length >= 2 ? searchPosts(query) : Promise.resolve([]),
    getAllTags(),
    getMostLikedPosts(3),
    getRecentPosts(5),
  ])
  const maisLidas = maisLidasPosts.length > 0 ? maisLidasPosts : posts.slice(0, 3)
  const sidebarRecent = posts.length >= 5 && query.length >= 2 ? posts.slice(0, 5) : recentPosts

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row lg:gap-8">
        <main className="flex-1">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="w-10 h-0.5 bg-blue-400 rounded" />
            Pesquisar
          </h1>
          <p className="text-white/70 text-sm mb-6">
            Encontre artigos por título, descrição ou conteúdo.
          </p>

          <SearchForm defaultValue={query} className="mb-8" />

          {query.length > 0 && query.length < 2 && (
            <p className="text-amber-400/90 text-sm py-4">
              Digite pelo menos 2 caracteres para pesquisar.
            </p>
          )}

          {query.length >= 2 && (
            <>
              <p className="text-white/80 text-sm mb-4">
                {posts.length === 0
                  ? `Nenhum post encontrado para "${query}".`
                  : `${posts.length} resultado${posts.length !== 1 ? 's' : ''} para "${query}".`}
              </p>
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
                    href={
                      post.categorySlug
                        ? `/categoria/${post.categorySlug}/${post.slug}`
                        : undefined
                    }
                  />
                ))}
              </div>
            </>
          )}

          {query.length === 0 && (
            <p className="text-white/60 text-sm py-4">
              Use o campo acima para buscar artigos.
            </p>
          )}
        </main>

        <Sidebar
          recentPosts={sidebarRecent}
          tags={tags}
          maisLidasPosts={maisLidas}
        />
      </div>
    </div>
  )
}
