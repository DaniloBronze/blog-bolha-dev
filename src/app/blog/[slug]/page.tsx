import { getPostBySlug, getAllPosts, getAllTags } from '@/lib/posts'
import { FaCalendar, FaTags, FaClock } from 'react-icons/fa'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Sidebar from '@/components/Sidebar'
import Link from 'next/link'
import LikeButton from './LikeButton'

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  const recentPosts = await getAllPosts()
  const tags = await getAllTags()

  if (!post) {
    notFound()
  }

  const currentIndex = recentPosts.findIndex(p => p.slug === post.slug)
  const hasPrevious = currentIndex > 0
  const hasNext = currentIndex < recentPosts.length - 1

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 sm:py-8">
      <div className="flex flex-col lg:flex-row lg:gap-8">
        <main className="flex-1">
          <article className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10">
            <div className="p-4 sm:p-6 lg:p-8">
              {/* Título */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-6">
                {post.title}
              </h1>

              {/* Metadados do post - responsivo */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center text-sm text-white/70 mb-6 sm:mb-8 gap-3 sm:gap-4">
                <span className="flex items-center">
                  <FaCalendar className="mr-2 flex-shrink-0" />
                  {new Date(post.date).toLocaleDateString('pt-BR')}
                </span>
                <span className="flex items-center">
                  <FaClock className="mr-2 flex-shrink-0" />
                  {post.readingTime.text}
                </span>
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <FaTags className="mr-1 flex-shrink-0" />
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/blog/tag/${tag}`}
                        className="bg-white/10 hover:bg-white/20 text-white/90 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Conteúdo do post - responsivo */}
              <div 
                className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-white prose-headings:text-white prose-a:text-blue-300 prose-strong:text-white prose-code:text-pink-300 prose-pre:bg-black/20 prose-blockquote:border-blue-400"
                dangerouslySetInnerHTML={{ __html: post.content }} 
              />

              {/* Seção de like destacada */}
              <div className="mt-8 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-400/20">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg font-semibold text-white mb-1">Gostou do post?</h3>
                    <p className="text-sm text-white/70">Deixe seu like e ajude a divulgar o conteúdo!</p>
                  </div>
                  <LikeButton postId={post.id.toString()} />
                </div>
              </div>
            </div>
          </article>

          {/* Navegação entre posts - responsivo */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
            {hasPrevious && (
              <Link
                href={`/blog/${recentPosts[currentIndex - 1].slug}`}
                className="group bg-white/10 hover:bg-white/20 text-white/90 px-4 sm:px-6 py-3 sm:py-4 rounded-lg transition-colors flex-1 sm:max-w-[48%]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg flex-shrink-0">←</span>
                  <div className="min-w-0 flex-1">
                    <small className="text-xs text-white/70">Post anterior</small>
                    <p className="font-medium text-sm group-hover:text-blue-300 transition-colors truncate">
                      {recentPosts[currentIndex - 1].title}
                    </p>
                  </div>
                </div>
              </Link>
            )}
            {hasNext && (
              <Link
                href={`/blog/${recentPosts[currentIndex + 1].slug}`}
                className="group bg-white/10 hover:bg-white/20 text-white/90 px-4 sm:px-6 py-3 sm:py-4 rounded-lg transition-colors flex-1 sm:max-w-[48%] text-right"
              >
                <div className="flex items-center gap-2 justify-end">
                  <div className="min-w-0 flex-1 text-right">
                    <small className="text-xs text-white/70">Próximo post</small>
                    <p className="font-medium text-sm group-hover:text-blue-300 transition-colors truncate">
                      {recentPosts[currentIndex + 1].title}
                    </p>
                  </div>
                  <span className="text-lg flex-shrink-0">→</span>
                </div>
              </Link>
            )}
          </div>
        </main>

        <Sidebar 
          recentPosts={recentPosts.filter(p => p.slug !== post.slug).slice(0, 5)} 
          tags={tags}
        />
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    return {
      title: 'Post não encontrado',
    }
  }

  return {
    title: post.title,
    description: post.description,
  }
}
