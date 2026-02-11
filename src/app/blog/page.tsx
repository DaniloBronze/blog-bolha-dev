import { getAllPosts, getAllTags, getMostLikedPosts } from '@/lib/posts'
import Link from 'next/link'
import PostCard from '@/components/PostCard'
import Sidebar from '@/components/Sidebar'

export const revalidate = 60

export const metadata = {
  title: 'Blog',
  description: 'Posts sobre programação, tecnologia e vendas com PraTuAqui.',
}

export default async function Blog() {
  const [posts, tags, maisLidasPosts] = await Promise.all([
    getAllPosts(),
    getAllTags(),
    getMostLikedPosts(3),
  ])

  const maisLidas = maisLidasPosts.length > 0 ? maisLidasPosts : posts.slice(0, 3)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row lg:gap-8">
        <main className="flex-1">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-10 h-0.5 bg-blue-400 rounded" />
            Blog
          </h1>
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
              />
            ))}
          </div>
          {posts.length === 0 && (
            <p className="text-white/80 py-8">Nenhum post publicado ainda.</p>
          )}
        </main>

        <Sidebar
          recentPosts={posts.slice(0, 5)}
          tags={tags}
          maisLidasPosts={maisLidas}
        />
      </div>
    </div>
  )
}
