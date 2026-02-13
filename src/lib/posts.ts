import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeStringify from 'rehype-stringify'
import { calculateReadingTime } from '@/utils/reading-time'

export interface Post {
  slug: string
  title: string
  date: string
  /** Data da última atualização (para exibir "Atualizado em") */
  updatedAt: string | null
  description: string
  tags: string[]
  content: string
  id: number
  likes: number
  /** URL da imagem principal/capa do post. */
  coverImage: string | null
  readingTime: {
    minutes: number
    text: string
  }
  /** Slug da categoria (para URL hierárquica e breadcrumb). */
  categorySlug?: string | null
  /** Nome da categoria (para exibição). */
  categoryName?: string | null
}

export function normalizeTag(tag: string): string {
  return tag
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais, exceto hífens e espaços
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove múltiplos hífens consecutivos
    .replace(/^-+|-+$/g, ''); // Remove hífens no início e no final
}

/**
 * Processa conteúdo Markdown para HTML com suporte a:
 * - GitHub Flavored Markdown (tabelas, listas de tarefas, etc)
 * - IDs automáticos nos cabeçalhos (h1-h6) para navegação por âncoras
 * - Links automáticos nos cabeçalhos
 * 
 * @param markdown - Conteúdo em Markdown
 * @returns HTML processado com IDs nos cabeçalhos
 */
export function processMarkdown(markdown: string): string {
  const processedContent = remark()
    .use(remarkGfm) // GitHub Flavored Markdown
    .use(remarkRehype) // Converte remark -> rehype (markdown -> HTML AST)
    .use(rehypeSlug) // Adiciona IDs aos cabeçalhos (h1-h6)
    .use(rehypeAutolinkHeadings, { // Adiciona links automáticos nos cabeçalhos
      behavior: 'wrap', // Envolve o texto do cabeçalho com o link
    })
    .use(rehypeStringify) // Converte HTML AST -> string HTML
    .processSync(markdown)
  
  return processedContent.toString()
}

/** Retorna slug, categoria e datas para sitemap (consulta leve). */
export async function getPostSlugsForSitemap(): Promise<
  { slug: string; categorySlug: string | null; publishedAt: Date; updatedAt: Date }[]
> {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      select: {
        slug: true,
        publishedAt: true,
        updatedAt: true,
        category: { select: { slug: true } },
      },
      orderBy: { publishedAt: 'desc' },
    } as Prisma.PostFindManyArgs)
    return (posts as { slug: string | null; publishedAt: Date | null; updatedAt: Date; category?: { slug: string } | null }[])
      .filter((p) => p.slug)
      .map((p) => ({
        slug: p.slug!,
        categorySlug: p.category?.slug ?? null,
        publishedAt: p.publishedAt || new Date(),
        updatedAt: p.updatedAt || new Date(),
      }))
  } catch (error) {
    console.error('Erro ao buscar slugs para sitemap:', error)
    return []
  }
}

const postInclude = {
  category: true,
  _count: { select: { likes: true } },
} as Prisma.PostInclude

function mapPrismaPostToPost(post: {
  slug: string | null
  title: string
  content: string
  description: string | null
  tags: string
  publishedAt: Date | null
  updatedAt?: Date | null
  id: number
  coverImage?: string | null
  category?: { slug: string; name: string } | null
  _count?: { likes: number }
}, contentHtml: string, showUpdated: boolean, updatedAtStr: string | null): Post {
  const publishedAt = post.publishedAt?.toISOString() || ''
  return {
    slug: post.slug || '',
    title: post.title || '',
    id: Number(post.id),
    date: publishedAt,
    updatedAt: showUpdated ? updatedAtStr : null,
    description: post.description || '',
    tags: JSON.parse(post.tags || '[]'),
    content: contentHtml,
    likes: post._count?.likes || 0,
    coverImage: post.coverImage || null,
    readingTime: calculateReadingTime(contentHtml),
    categorySlug: post.category?.slug ?? null,
    categoryName: post.category?.name ?? null,
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: postInclude,
    } as Prisma.PostFindUniqueArgs)

    if (!post) return null

    const contentHtml = processMarkdown(post.content)
    const updatedAt = (post as { updatedAt?: Date | null }).updatedAt
    const publishedAt = post.publishedAt?.toISOString() || ''
    const updatedAtStr = updatedAt ? new Date(updatedAt).toISOString() : null
    const showUpdated = !!updatedAtStr && updatedAtStr !== publishedAt

    return mapPrismaPostToPost(post as any, contentHtml, showUpdated, updatedAtStr)
  } catch (error) {
    console.error('Erro ao buscar post:', error)
    return null
  }
}

/** Busca post pela URL hierárquica: /categoria/[categorySlug]/[postSlug]. */
export async function getPostByCategorySlugAndPostSlug(
  categorySlug: string,
  postSlug: string
): Promise<Post | null> {
  try {
    const post = await prisma.post.findFirst({
      where: {
        slug: postSlug,
        published: true,
        category: { slug: categorySlug },
      },
      include: postInclude,
    } as Prisma.PostFindFirstArgs)
    if (!post) return null

    const contentHtml = processMarkdown(post.content)
    const updatedAt = (post as { updatedAt?: Date | null }).updatedAt
    const publishedAt = post.publishedAt?.toISOString() || ''
    const updatedAtStr = updatedAt ? new Date(updatedAt).toISOString() : null
    const showUpdated = !!updatedAtStr && updatedAtStr !== publishedAt

    return mapPrismaPostToPost(post as any, contentHtml, showUpdated, updatedAtStr)
  } catch (error) {
    console.error('Erro ao buscar post por categoria e slug:', error)
    return null
  }
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { publishedAt: 'desc' },
      where: { published: true },
      include: { category: true },
    } as Prisma.PostFindManyArgs)

    return (posts as any[]).map((post: any) => {
      const contentHtml = processMarkdown(post.content)
      return {
        slug: post.slug || '',
        title: post.title || '',
        id: Number(post.id),
        date: post.publishedAt?.toISOString() || '',
        updatedAt: null,
        description: post.description || '',
        tags: JSON.parse(post.tags || '[]'),
        content: contentHtml || '',
        likes: 0,
        coverImage: post.coverImage || null,
        readingTime: calculateReadingTime(contentHtml),
        categorySlug: post.category?.slug ?? null,
        categoryName: post.category?.name ?? null,
      }
    })
  } catch (error) {
    console.error('Erro ao buscar todos os posts:', error)
    return []
  }
}

/** Posts mais curtidos (para bloco "Mais lidas" / destaque). */
export async function getMostLikedPosts(count: number = 3): Promise<Post[]> {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { likes: { _count: 'desc' } },
      take: count,
      include: { _count: { select: { likes: true } }, category: true },
    } as Prisma.PostFindManyArgs)
    return (posts as any[]).map((post: any) => {
      const contentHtml = processMarkdown(post.content)
      return {
        slug: post.slug || '',
        title: post.title || '',
        id: Number(post.id),
        date: post.publishedAt?.toISOString() || '',
        updatedAt: null,
        description: post.description || '',
        tags: JSON.parse(post.tags || '[]'),
        content: contentHtml || '',
        likes: post._count?.likes || 0,
        coverImage: post.coverImage || null,
        readingTime: calculateReadingTime(contentHtml),
        categorySlug: post.category?.slug ?? null,
        categoryName: post.category?.name ?? null,
      }
    })
  } catch (error) {
    console.error('Erro ao buscar posts mais curtidos:', error)
    return []
  }
}

/** Busca posts por termo (título, descrição, conteúdo ou tags). Retorna lista no mesmo formato para listagem. */
export async function searchPosts(query: string): Promise<Post[]> {
  const q = query?.trim()
  if (!q || q.length < 2) return []

  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { content: { contains: q, mode: 'insensitive' } },
          { tags: { contains: q, mode: 'insensitive' } },
        ],
      },
      orderBy: { publishedAt: 'desc' },
      include: { category: true },
    } as Prisma.PostFindManyArgs)

    return (posts as any[]).map((post: any) => {
      const contentHtml = processMarkdown(post.content)
      return {
        slug: post.slug || '',
        title: post.title || '',
        id: Number(post.id),
        date: post.publishedAt?.toISOString() || '',
        updatedAt: null,
        description: post.description || '',
        tags: JSON.parse(post.tags || '[]'),
        content: contentHtml || '',
        likes: 0,
        coverImage: post.coverImage || null,
        readingTime: calculateReadingTime(contentHtml),
        categorySlug: post.category?.slug ?? null,
        categoryName: post.category?.name ?? null,
      }
    })
  } catch (error) {
    console.error('Erro ao buscar posts:', error)
    return []
  }
}

export async function getRecentPosts(count: number = 5): Promise<Post[]> {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { publishedAt: 'desc' },
      take: count,
      where: { published: true },
      include: { category: true },
    } as Prisma.PostFindManyArgs)

    return (posts as any[]).map((post: any) => {
      const contentHtml = processMarkdown(post.content)
      return {
        slug: post.slug || '',
        title: post.title || '',
        id: Number(post.id),
        date: post.publishedAt?.toISOString() || '',
        updatedAt: null,
        description: post.description || '',
        tags: JSON.parse(post.tags || '[]'),
        content: contentHtml || '',
        likes: 0,
        coverImage: post.coverImage || null,
        readingTime: calculateReadingTime(contentHtml),
        categorySlug: post.category?.slug ?? null,
        categoryName: post.category?.name ?? null,
      }
    })
  } catch (error) {
    console.error('Erro ao buscar posts recentes:', error)
    return []
  }
}

/** Lista posts de uma categoria com paginação. */
export async function getPostsByCategorySlug(
  categorySlug: string,
  options?: { page?: number; limit?: number }
): Promise<{ posts: Post[]; total: number }> {
  const page = Math.max(1, options?.page ?? 1)
  const limit = Math.min(50, Math.max(1, options?.limit ?? 12))
  const skip = (page - 1) * limit

  try {
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: { published: true, category: { slug: categorySlug } },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
        include: { category: true },
      } as Prisma.PostFindManyArgs),
      prisma.post.count({
        where: { published: true, category: { slug: categorySlug } },
      } as Prisma.PostCountArgs),
    ])

    const mapped = posts.map((post: any) => {
      const contentHtml = processMarkdown(post.content)
      return {
        slug: post.slug || '',
        title: post.title || '',
        id: Number(post.id),
        date: post.publishedAt?.toISOString() || '',
        updatedAt: null,
        description: post.description || '',
        tags: JSON.parse(post.tags || '[]'),
        content: contentHtml || '',
        likes: 0,
        coverImage: post.coverImage || null,
        readingTime: calculateReadingTime(contentHtml),
        categorySlug: post.category?.slug ?? null,
        categoryName: post.category?.name ?? null,
      }
    })
    return { posts: mapped, total }
  } catch (error) {
    console.error('Erro ao buscar posts por categoria:', error)
    return { posts: [], total: 0 }
  }
}

export async function getAllTags(): Promise<string[]> {
  try {
    const posts = await prisma.post.findMany({
      select: { tags: true },
    })

    const tagsSet = new Set<string>()

    posts.forEach((post: any) => {
      const tagsArray = JSON.parse(post.tags || '[]')
      tagsArray.forEach((tag: string) => tagsSet.add(normalizeTag(tag)))
    })

    return Array.from(tagsSet)
  } catch (error) {
    console.error('Erro ao buscar tags:', error)
    return []
  }
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const normalizedSearchTag = normalizeTag(tag)

  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      include: { _count: { select: { likes: true } }, category: true },
    } as Prisma.PostFindManyArgs)

    const filteredPosts = (posts as any[]).filter((post: any) => {
      const tagsArray = JSON.parse(post.tags || '[]')
      return tagsArray.map(normalizeTag).includes(normalizedSearchTag)
    })

    return filteredPosts.map((post: any) => {
      const contentHtml = processMarkdown(post.content)
      return {
        slug: post.slug || '',
        title: post.title || '',
        id: Number(post.id),
        date: post.publishedAt?.toISOString() || '',
        updatedAt: null,
        description: post.description || '',
        tags: JSON.parse(post.tags || '[]'),
        content: contentHtml || '',
        likes: post._count?.likes || 0,
        coverImage: post.coverImage || null,
        readingTime: calculateReadingTime(contentHtml),
        categorySlug: post.category?.slug ?? null,
        categoryName: post.category?.name ?? null,
      }
    })
  } catch (error) {
    console.error('Erro ao buscar posts por tag:', error)
    return []
  }
}
