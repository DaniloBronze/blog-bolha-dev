import { prisma } from '@/lib/prisma'
import { remark } from 'remark'
import html from 'remark-html'
import remarkGfm from 'remark-gfm'
import { calculateReadingTime } from '@/utils/reading-time'

export interface Post {
  slug: string
  title: string
  date: string
  description: string
  tags: string[]
  content: string
  id: number
  likes: number
  readingTime: {
    minutes: number
    text: string
  }
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

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            likes: true, // Contando os likes associados ao post
          },
        },
      },
    })

    if (!post) return null

    const processedContent = await remark()
      .use(html)
      .use(remarkGfm)
      .process(post.content)
    const contentHtml = processedContent.toString()

    const readingTime = calculateReadingTime(contentHtml)

    return {
      slug: post.slug || '',
      title: post.title || '',
      id: Number(post.id),
      date: post.publishedAt?.toISOString() || '',
      description: post.description || '',
      tags: JSON.parse(post.tags || '[]'),
      content: contentHtml || '',
      likes: post._count?.likes || 0,
      readingTime,
    }
  } catch (error) {
    console.error('Erro ao buscar post:', error)
    return null
  }
}


export async function getAllPosts(): Promise<Post[]> {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        publishedAt: 'desc',
      },
      where: {
        published: true
      }
    })

    return posts.map((post: any) => {
      // Processa markdown de forma síncrona para ser mais rápido
      const processedContent = remark()
        .use(html)
        .use(remarkGfm)
        .processSync(post.content)
      const contentHtml = processedContent.toString()

      return {
        slug: post.slug || '',
        title: post.title || '',
        id: Number(post.id),
        date: post.publishedAt?.toISOString() || '',
        description: post.description || '',
        tags: JSON.parse(post.tags || '[]'),
        content: contentHtml || '',
        likes: 0, // Simplificado para performance
        readingTime: calculateReadingTime(contentHtml),
      }
    })
  } catch (error) {
    console.error('Erro ao buscar todos os posts:', error)
    return []
  }
}

export async function getRecentPosts(count: number = 5): Promise<Post[]> {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        publishedAt: 'desc',
      },
      take: count,
      where: {
        published: true
      }
    })

    return posts.map((post: any) => {
      // Processa markdown de forma síncrona para ser mais rápido
      const processedContent = remark()
        .use(html)
        .use(remarkGfm)
        .processSync(post.content)
      const contentHtml = processedContent.toString()

      return {
        slug: post.slug || '',
        title: post.title || '',
        id: Number(post.id),
        date: post.publishedAt?.toISOString() || '',
        description: post.description || '',
        tags: JSON.parse(post.tags || '[]'),
        content: contentHtml || '',
        likes: 0, // Simplificado para performance
        readingTime: calculateReadingTime(contentHtml),
      }
    })
  } catch (error) {
    console.error('Erro ao buscar posts recentes:', error)
    return []
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
      include: {
        _count: {
          select: {
            likes: true,
          },
        },
      },
    })

    const filteredPosts = posts.filter((post: any) => {
      const tagsArray = JSON.parse(post.tags || '[]')
      return tagsArray.map(normalizeTag).includes(normalizedSearchTag)
    })

    return Promise.all(filteredPosts.map(async (post: any) => {
      const processedContent = await remark()
        .use(html)
        .use(remarkGfm)
        .process(post.content)
      const contentHtml = processedContent.toString()

      return {
        slug: post.slug || '',
        title: post.title || '',
        id: Number(post.id),
        date: post.publishedAt?.toISOString() || '',
        description: post.description || '',
        tags: JSON.parse(post.tags || '[]'),
        content: contentHtml || '',
        likes: post._count?.likes || 0,
        readingTime: calculateReadingTime(contentHtml),
      }
    }))
  } catch (error) {
    console.error('Erro ao buscar posts por tag:', error)
    return []
  }
}
