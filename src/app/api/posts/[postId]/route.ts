import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function DELETE(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const post = await prisma.post.findUnique({ where: { id: Number(params.postId) }, select: { slug: true, tags: true } })
    await prisma.post.delete({
      where: { id: Number(params.postId) },
    })

    if (post) {
      revalidatePath('/')
      revalidatePath('/blog')
      revalidatePath(`/blog/${post.slug}`)
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
        likes: true
      }
    })
    
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
    const updatedPost = await prisma.post.update({
      where: { id: Number(params.postId) },
      data: {
        title: body.title,
        description: body.description,
        content: body.content,
        coverImage: body.hasOwnProperty('coverImage') ? (body.coverImage || null) : undefined,
        published: body.published,
        publishedAt: body.publishedAt,
        tags: JSON.stringify(body.tags),
      } as Prisma.PostUpdateInput,
    })

    revalidatePath('/')
    revalidatePath('/blog')
    revalidatePath(`/blog/${updatedPost.slug}`)
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
