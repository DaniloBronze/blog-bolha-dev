import { prisma } from '@/lib/prisma'

/** Prisma client com modelo Category (o tipo gerado pode não expor .category). */
const db = prisma as typeof prisma & { category: { findMany: (args?: object) => Promise<{ id: number; name: string; slug: string; description: string | null }[]>; findUnique: (args: { where: { slug: string } }) => Promise<{ id: number; name: string; slug: string; description: string | null } | null> } }

export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
}

export async function getAllCategories(): Promise<Category[]> {
  try {
    const list = await db.category.findMany({
      orderBy: { name: 'asc' },
    })
    return list.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
    }))
  } catch (error) {
    console.error('Erro ao buscar categorias:', error)
    return []
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const c = await db.category.findUnique({
      where: { slug },
    })
    if (!c) return null
    return {
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
    }
  } catch (error) {
    console.error('Erro ao buscar categoria:', error)
    return null
  }
}

export async function getCategoryIdsForSitemap(): Promise<{ slug: string }[]> {
  try {
    const list = await db.category.findMany({
      select: { slug: true },
    } as { select: { slug: true } })
    return list.map((c) => ({ slug: c.slug }))
  } catch (error) {
    console.error('Erro ao buscar slugs de categorias:', error)
    return []
  }
}
