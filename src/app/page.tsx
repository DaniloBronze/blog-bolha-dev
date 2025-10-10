import Link from 'next/link'
import { FaCalendar, FaClock, FaTags, FaArrowRight } from 'react-icons/fa'
import Sidebar from '@/components/Sidebar'
import { getRecentPosts, getAllTags } from '@/lib/posts'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const recentPosts = await getRecentPosts(6)
  const tags = await getAllTags()

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row lg:gap-8">
        <main className="flex-1">
          {/* <section className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Blog do <span className="text-blue-300">Danilo Silva</span>
            </h1>
            <p className="text-lg text-white/80 mb-6">
              Artigos sobre desenvolvimento, tecnologia e programação
            </p>
            <Link
              href="/sobre"
              className="inline-flex items-center text-blue-300 hover:text-blue-200 transition-colors"
            >
              Sobre mim <FaArrowRight className="ml-2" />
            </Link>
          </section> */}

          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Posts Recentes</h2>
            <div className="space-y-6">
              {recentPosts.map((post) => (
                <article
                  key={post.slug}
                  className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 hover:bg-white/20 transition-colors"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <h3 className="text-xl font-bold text-white hover:text-blue-300 transition-colors">
                        <Link href={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h3>
                    </div>

                    <p className="text-white/70 mb-4 line-clamp-3">
                      {post.description}
                    </p>

                    <div className="flex flex-wrap items-center text-sm text-white/60 mb-4 gap-4">
                      <span className="flex items-center">
                        <FaCalendar className="mr-2" />
                        {new Date(post.date).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="flex items-center">
                        <FaClock className="mr-2" />
                        {post.readingTime.text}
                      </span>
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2">
                          <FaTags className="mr-1" />
                          {post.tags.slice(0, 3).map((tag) => (
                            <Link
                              key={tag}
                              href={`/blog/tag/${tag}`}
                              className="bg-white/10 hover:bg-white/20 text-white/90 px-2 py-1 rounded-full text-xs transition-colors"
                            >
                              {tag}
                            </Link>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="text-white/60">+{post.tags.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center text-blue-300 hover:text-blue-200 transition-colors"
                    >
                      Ler mais <FaArrowRight className="ml-2" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {recentPosts.length > 0 && (
              <div className="mt-8 text-center">
                <Link
                  href="/blog"
                  className="bg-blue-600/30 text-white px-6 py-3 rounded-lg hover:bg-blue-500/40 transition-colors flex items-center justify-center backdrop-blur-sm border border-blue-400/30 inline-flex"
                >
                  Ver todos os posts <FaArrowRight className="ml-2" />
                </Link>
              </div>
            )}
          </section>
        </main>

        <Sidebar recentPosts={recentPosts.slice(0, 5)} tags={tags} />
      </div>
    </div>
  )
}
