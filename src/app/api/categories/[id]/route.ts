import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

/** Prisma client com modelo Category (tipo gerado pode não expor .category). */
const db = prisma as typeof prisma & { category: { findUnique: (args: { where: { id: number } }) => Promise<{ id: number; name: string; slug: string; description: string | null } | null>; update: (args: { where: { id: number }; data: object }) => Promise<{ slug: string }>; delete: (args: { where: { id: number } }) => Promise<unknown> } }

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id)
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }
    const category = await db.category.findUnique({
      where: { id },
    })
    if (!category) {
      return NextResponse.json({ error: 'Categoria não encontrada' }, { status: 404 })
    }
    return NextResponse.json(category)
  } catch (error) {
    console.error('Erro ao buscar categoria:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar categoria' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id)
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }
    const body = await request.json()
    const { name, slug, description } = body

    const category = await db.category.update({
      where: { id },
      data: {
        ...(name != null && { name }),
        ...(slug != null && { slug: slug.trim().toLowerCase().replace(/\s+/g, '-') }),
        ...(description !== undefined && { description: description?.trim() || null }),
      },
    })

    revalidatePath('/')
    revalidatePath('/categorias')
    revalidatePath(`/categoria/${category.slug}`)
    return NextResponse.json(category)
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar categoria' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id)
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }
    const category = await db.category.findUnique({
      where: { id },
      select: { slug: true },
    } as { where: { id: number }; select: { slug: true } })
    await db.category.delete({ where: { id } })
    if (category) {
      revalidatePath('/')
      revalidatePath('/categorias')
      revalidatePath(`/categoria/${category.slug}`)
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao excluir categoria:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir categoria' },
      { status: 500 }
    )
  }
}
