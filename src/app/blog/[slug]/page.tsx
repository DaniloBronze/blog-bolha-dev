import { getPostBySlug, getAllPosts, getAllTags } from '@/lib/posts'
import { FaCalendar, FaTags } from 'react-icons/fa'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Sidebar from '@/components/Sidebar'
import Link from 'next/link'
import LikeButton from './LikeButton'
import LikeCounter from './LikeCounter'

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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row lg:gap-8">
        <main className="flex-1">
          <article className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-4xl font-bold text-white">{post.title}</h1>
                <div className="flex items-center gap-2">
                  <LikeButton postId={post.id.toString()} />
                  <LikeCounter postId={post.id.toString()} />
                </div>
              </div>

              <div className="flex flex-wrap items-center text-sm text-white/70 mb-8 gap-4">
                <span className="mr-4 flex items-center">
                  <FaCalendar className="mr-2" />
                  {new Date(post.date).toLocaleDateString('pt-BR')}
                </span>
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <FaTags className="mr-1" />
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/blog/tag/${tag}`}
                        className="bg-white/10 hover:bg-white/20 text-white/90 px-3 py-1 rounded-full text-sm transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div 
                className="prose prose-lg max-w-none text-white"
                dangerouslySetInnerHTML={{ __html: post.content }} 
              />
            </div>
          </article>

          <div className="mt-8 flex justify-between gap-4">
            {hasPrevious && (
              <Link
                href={`/blog/${recentPosts[currentIndex - 1].slug}`}
                className="group bg-white/10 hover:bg-white/20 text-white/90 px-6 py-4 rounded-lg transition-colors flex-1 max-w-[48%]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">←</span>
                  <div>
                    <small className="text-xs text-white/70">Post anterior</small>
                    <p className="font-medium text-sm group-hover:text-blue-300 transition-colors">
                      {recentPosts[currentIndex - 1].title}
                    </p>
                  </div>
                </div>
              </Link>
            )}
            {hasNext && (
              <Link
                href={`/blog/${recentPosts[currentIndex + 1].slug}`}
                className="group bg-white/10 hover:bg-white/20 text-white/90 px-6 py-4 rounded-lg transition-colors flex-1 max-w-[48%] text-right"
              >
                <div className="flex items-center gap-2 justify-end">
                  <div>
                    <small className="text-xs text-white/70">Próximo post</small>
                    <p className="font-medium text-sm group-hover:text-blue-300 transition-colors">
                      {recentPosts[currentIndex + 1].title}
                    </p>
                  </div>
                  <span className="text-lg">→</span>
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
