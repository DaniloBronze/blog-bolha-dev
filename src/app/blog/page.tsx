import { getAllPosts, getAllTags } from '@/lib/posts'
import Link from 'next/link'
import { FaCalendar, FaTags } from 'react-icons/fa'
import Sidebar from '@/components/Sidebar'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: 'Blog',
  description: 'Meus posts sobre programação e tecnologia',
}

export default async function Blog() {
  const posts = await getAllPosts()
  const tags = await getAllTags()

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row lg:gap-8">
        <main className="flex-1">
          <h1 className="text-4xl font-bold text-white mb-8">Blog</h1>
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
        </main>

        <Sidebar recentPosts={posts.slice(0, 5)} tags={tags} />
      </div>
    </div>
  )
}
