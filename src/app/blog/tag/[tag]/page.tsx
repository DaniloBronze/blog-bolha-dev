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

/**
 * Converte tag normalizada (URL) para formato de exibição
 * Ex: "vender-na-shopee" → "Vender na Shopee"
 */
function denormalizeTag(normalizedTag: string): string {
  return normalizedTag
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default async function TagPage({ params }: Props) {
  const { tag } = params // tag vem normalizada da URL (ex: "vender-na-shopee")
  
  const [posts, allTags, maisLidasPosts] = await Promise.all([
    getPostsByTag(tag), // busca posts com tag normalizada
    getAllTags(),
    getMostLikedPosts(3),
  ])

  // Valida se tag existe
  if (!allTags.includes(tag)) {
    notFound()
  }

  const maisLidas = maisLidasPosts.length > 0 ? maisLidasPosts : posts.slice(0, 3)
  const displayTag = denormalizeTag(tag) // para exibir bonito no título

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row lg:gap-16 lg:items-start">
        <main className="flex-1 min-w-0 lg:max-w-[calc(100%-18rem)] xl:max-w-[calc(100%-20rem)]">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="w-10 h-0.5 bg-emerald-400 rounded" />
            {displayTag}
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
  const displayTag = denormalizeTag(tag)

  return {
    title: `Posts com a tag "${displayTag}" | Blog`,
    description: `Lista de posts relacionados à tag ${displayTag}`,
  }
}
