import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'  // <- Desativa cache da API
export const revalidate = 60 // 1 minuto

export async function GET(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const likesCount = await prisma.like.count({
      where: {
        postId: Number(params.postId),
      },
    })

    return NextResponse.json({ count: likesCount })
  } catch (error) {
    console.error('Error fetching likes:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const headersList = headers()
    const ip = headersList.get('x-forwarded-for') || 'unknown'

    const existingLike = await prisma.like.findFirst({
      where: {
        postId: Number(params.postId),
        ipAddress: ip,
      },
    })

    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      })
      return NextResponse.json({ liked: false })
    }

    await prisma.like.create({
      data: {
        postId: Number(params.postId),
        ipAddress: ip,
      },
    })

    return NextResponse.json({ liked: true })
  } catch (error) {
    console.error('Error toggling like:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
