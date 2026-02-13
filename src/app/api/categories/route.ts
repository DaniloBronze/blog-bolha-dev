import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/** Prisma client com modelo Category (tipo gerado pode não expor .category). */
const db = prisma as typeof prisma & { category: { findMany: (args?: object) => Promise<unknown[]>; create: (args: { data: object }) => Promise<unknown> } }

export async function GET() {
  try {
    const categories = await db.category.findMany({
      orderBy: { name: 'asc' },
    })
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Erro ao listar categorias:', error)
    return NextResponse.json(
      { error: 'Erro ao listar categorias' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, slug, description } = body

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Nome e slug são obrigatórios' },
        { status: 400 }
      )
    }

    const category = await db.category.create({
      data: {
        name,
        slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
        description: description?.trim() || null,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('Erro ao criar categoria:', error)
    return NextResponse.json(
      { error: 'Erro ao criar categoria' },
      { status: 500 }
    )
  }
}
