import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/** Tipo com category para quando o Prisma client ainda não expõe a relação nos tipos. */
type PostWithCategory = { slug: string; tags: string; category: { slug: string } | null }

export async function DELETE(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(params.postId) },
      include: { category: { select: { slug: true } } },
    } as Prisma.PostFindUniqueArgs) as PostWithCategory | null
    await prisma.post.delete({
      where: { id: Number(params.postId) },
    })

    if (post) {
      revalidatePath('/')
      revalidatePath('/blog')
      revalidatePath('/categorias')
      revalidatePath(`/blog/${post.slug}`)
      if (post.category) {
        revalidatePath(`/categoria/${post.category.slug}`)
        revalidatePath(`/categoria/${post.category.slug}/${post.slug}`)
      }
      try {
        const tagList = typeof post.tags === 'string' ? JSON.parse(post.tags || '[]') : []
        tagList.forEach((tag: string) => {
          const normalized = tag.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '')
          if (normalized) revalidatePath(`/blog/tag/${normalized}`)
        })
      } catch (_) {}
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar post:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar post' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(params.postId) },
      include: {
        comments: true,
        likes: true,
        category: true,
      },
    } as Prisma.PostFindUniqueArgs)
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post não encontrado' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar post' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { postId: string } }
) {
  const body = await request.json()
  
  try {
    const updatedPost = (await prisma.post.update({
      where: { id: Number(params.postId) },
      data: {
        title: body.title,
        description: body.description,
        content: body.content,
        coverImage: body.hasOwnProperty('coverImage') ? (body.coverImage || null) : undefined,
        published: body.published,
        publishedAt: body.publishedAt,
        tags: JSON.stringify(body.tags ?? []),
        ...(body.hasOwnProperty('categoryId') && { categoryId: body.categoryId != null ? Number(body.categoryId) : null }),
      } as Prisma.PostUpdateInput,
      include: { category: true },
    } as Prisma.PostUpdateArgs)) as { slug: string; category?: { slug: string } | null }

    revalidatePath('/')
    revalidatePath('/blog')
    revalidatePath('/categorias')
    revalidatePath(`/blog/${updatedPost.slug}`)
    if (updatedPost.category) {
      revalidatePath(`/categoria/${updatedPost.category.slug}`)
      revalidatePath(`/categoria/${updatedPost.category.slug}/${updatedPost.slug}`)
    }
    const tags = typeof body.tags === 'string' ? JSON.parse(body.tags || '[]') : (body.tags || [])
    tags.forEach((tag: string) => {
      try {
        const normalized = tag.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '')
        if (normalized) revalidatePath(`/blog/tag/${normalized}`)
      } catch (_) {}
    })

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error('Erro ao atualizar post:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar post' },
      { status: 500 }
    )
  }
}
