import { getMostLikedPosts } from '@/lib/posts'

/** Lista pública de posts em alta (para sidebar de pesquisa). */
export async function GET() {
  const posts = await getMostLikedPosts(10)
  const list = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    categorySlug: p.categorySlug ?? null,
  }))
  return Response.json(list)
}
