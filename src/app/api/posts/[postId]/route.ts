import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function DELETE(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    await prisma.post.delete({
      where: { id: Number(params.postId) },
    })

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
        published: body.published,
        publishedAt: body.publishedAt,
        tags: JSON.stringify(body.tags)
      }
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
