import { getAllTags, getPostsByTag } from '@/lib/posts'
import Link from 'next/link'
import { FaCalendar, FaTags } from 'react-icons/fa'
import Sidebar from '@/components/Sidebar'
import { notFound } from 'next/navigation'

interface Props {
  params: {
    tag: string
  }
}

export async function generateStaticParams() {
  const tags = await getAllTags()
  return tags.map((tag) => ({
    tag: tag,
  }))
}

export default async function TagPage({ params }: Props) {
  const { tag } = params
  const posts = await getPostsByTag(tag)
  const allTags = await getAllTags()

  if (!allTags.includes(tag)) {
    notFound()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row lg:gap-8">
        <main className="flex-1">
          <div className="flex items-center gap-4 mb-8">
            <h1 className="text-4xl font-bold text-white">Posts com a tag</h1>
            <span className="bg-blue-600/50 text-white px-4 py-1 rounded-full text-lg">
              {tag}
            </span>
          </div>

          <div className="space-y-6">
            {posts.map((post) => (
              <article key={post.slug} className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 hover:bg-white/20 transition-colors">
                <Link href={`/blog/${post.slug}`}>
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {post.title}
                    </h2>
                    <div className="flex items-center text-sm text-white/70 mb-4">
                      <span className="mr-4 flex items-center">
                        <FaCalendar className="mr-2" />
                        {new Date(post.date).toLocaleDateString('pt-BR')}
                      </span>
                      {post.tags && post.tags.length > 0 && (
                        <span className="flex items-center">
                          <FaTags className="mr-2" />
                          {post.tags.join(', ')}
                        </span>
                      )}
                    </div>
                    <p className="text-white/80">
                      {post.description}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {posts.length === 0 && (
            <p className="text-white/80 text-center py-8">
              Nenhum post encontrado com esta tag.
            </p>
          )}
        </main>

        <Sidebar recentPosts={posts.slice(0, 5)} tags={allTags} currentTag={tag} />
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: Props) {
  const { tag } = params

  return {
    title: `Posts com a tag "${tag}" | Blog`,
    description: `Lista de posts relacionados à tag ${tag}`,
  }
}
