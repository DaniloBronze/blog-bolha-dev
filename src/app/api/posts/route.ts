import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
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
        category: true,
      },
    } as Prisma.PostFindManyArgs)

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
    const { title, content, description, tags, slug, published, publishedAt, coverImage, categoryId } = json

    const post = await prisma.post.create({
      data: {
        title,
        content,
        description,
        tags: JSON.stringify(tags ?? []),
        slug,
        published,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        coverImage: coverImage || null,
        categoryId: categoryId != null ? Number(categoryId) : null,
      } as Prisma.PostCreateInput,
    })

    revalidatePath('/')
    revalidatePath('/blog')
    revalidatePath('/categorias')
    revalidatePath(`/blog/${post.slug}`)
    const postWithCat = post as { categoryId?: number | null }
    const cat = postWithCat.categoryId ? await (prisma as unknown as { category: { findUnique: (args: object) => Promise<{ slug: string } | null> } }).category.findUnique({ where: { id: postWithCat.categoryId }, select: { slug: true } }) : null
    if (cat) revalidatePath(`/categoria/${cat.slug}`)
    if (cat) revalidatePath(`/categoria/${cat.slug}/${post.slug}`)

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
