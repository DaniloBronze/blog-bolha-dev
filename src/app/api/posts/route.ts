import { NextResponse } from 'next/server'
import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        comments: true,
        likes: true,
      },
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching admin posts:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const { title, content, description, tags, slug, published, publishedAt, coverImage } = json

    const post = await prisma.post.create({
      data: {
        title,
        content,
        description,
        tags: JSON.stringify(tags),
        slug,
        published,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        coverImage: coverImage || null,
      } as Prisma.PostCreateInput,
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
