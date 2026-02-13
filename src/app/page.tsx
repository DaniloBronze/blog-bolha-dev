import Link from 'next/link'
import Sidebar from '@/components/Sidebar'
import PostCard from '@/components/PostCard'
import { getRecentPosts, getAllTags, getMostLikedPosts } from '@/lib/posts'

export const revalidate = 60

export default async function Home() {
  const [recentPosts, tags, maisLidasPosts] = await Promise.all([
    getRecentPosts(7),
    getAllTags(),
    getMostLikedPosts(3),
  ])

  const featuredPost = recentPosts[0]
  const maisRecentesPosts = recentPosts.slice(1, 7)
  const maisLidas = maisLidasPosts.length > 0 ? maisLidasPosts : recentPosts.slice(0, 3)

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
      <div className="flex flex-col lg:flex-row lg:gap-16 lg:items-start">
        <main className="flex-1 min-w-0 lg:max-w-[calc(100%-18rem)] xl:max-w-[calc(100%-20rem)]">
          {/* Hero – post em destaque (estilo Ei NERD) */}
          {featuredPost && (
            <section className="mb-8">
              <Link
                href={featuredPost.categorySlug ? `/categoria/${featuredPost.categorySlug}/${featuredPost.slug}` : `/blog/${featuredPost.slug}`}
                className="block group rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-blue-900/10"
              >
                <div className="relative h-56 sm:h-72 flex flex-col justify-end p-4 sm:p-6 bg-gradient-to-br from-blue-900/90 via-indigo-900/80 to-slate-900/90">
                  {featuredPost.coverImage && (
                    <img
                      src={featuredPost.coverImage}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover object-center opacity-70 group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                  <span className="absolute top-3 left-3 bg-amber-500 text-neutral-900 text-xs font-bold uppercase px-2.5 py-1 rounded-lg z-10 shadow-lg">
                    Destaque
                  </span>
                  {featuredPost.categoryName && (
                    <span className="absolute top-3 right-3 bg-white/10 backdrop-blur text-white/90 text-xs font-medium px-2.5 py-1 rounded-lg z-10">
                      {featuredPost.categoryName}
                    </span>
                  )}
                  <h1 className="relative z-10 text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight group-hover:text-blue-300 transition-colors line-clamp-2">
                    {featuredPost.title}
                  </h1>
                  <span className="relative z-10 block w-12 h-0.5 bg-amber-400 mt-2 rounded" />
                  <p className="relative z-10 text-white/80 text-sm sm:text-base mt-2 line-clamp-2">
                    {featuredPost.description}
                  </p>
                </div>
              </Link>
            </section>
          )}

          {/* Mais recentes */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-5 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-amber-400 rounded" />
              Mais recentes
            </h2>
            <div className="space-y-4">
              {maisRecentesPosts.map((post, i) => (
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
                  horizontal
                  badge={i === 0 ? 'Agora mesmo' : undefined}
                  href={post.categorySlug ? `/categoria/${post.categorySlug}/${post.slug}` : undefined}
                />
              ))}
            </div>

            {recentPosts.length > 0 && (
              <div className="mt-8 text-center">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 bg-blue-600/80 text-white px-6 py-3 rounded-lg hover:bg-blue-500 transition-colors text-sm font-medium"
                >
                  Ver todos os posts
                  <span aria-hidden>→</span>
                </Link>
              </div>
            )}
          </section>
        </main>

        <Sidebar
          recentPosts={recentPosts.slice(0, 5)}
          tags={tags}
          maisLidasPosts={maisLidas}
        />
      </div>
    </div>
  )
}
