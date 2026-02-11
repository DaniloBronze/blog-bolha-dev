import { getAllTags, getPostsByTag, getMostLikedPosts } from '@/lib/posts'
import Sidebar from '@/components/Sidebar'
import PostCard from '@/components/PostCard'
import { notFound } from 'next/navigation'

export const revalidate = 60

interface Props {
  params: { tag: string }
}

export async function generateStaticParams() {
  const tags = await getAllTags()
  return tags.map((tag) => ({ tag }))
}

export default async function TagPage({ params }: Props) {
  const { tag } = params
  const [posts, allTags, maisLidasPosts] = await Promise.all([
    getPostsByTag(tag),
    getAllTags(),
    getMostLikedPosts(3),
  ])

  if (!allTags.includes(tag)) {
    notFound()
  }

  const maisLidas = maisLidasPosts.length > 0 ? maisLidasPosts : posts.slice(0, 3)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row lg:gap-8">
        <main className="flex-1">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="w-10 h-0.5 bg-emerald-400 rounded" />
            {tag}
          </h1>
          <p className="text-white/70 text-sm mb-6">Posts com esta tag</p>

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
            <p className="text-white/80 text-center py-8">
              Nenhum post encontrado com esta tag.
            </p>
          )}
        </main>

        <Sidebar
          recentPosts={posts.slice(0, 5)}
          tags={allTags}
          currentTag={tag}
          maisLidasPosts={maisLidas}
        />
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
