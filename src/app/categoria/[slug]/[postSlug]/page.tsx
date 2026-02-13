import {
  getPostByCategorySlugAndPostSlug,
  getPostsByCategorySlug,
  getAllTags,
  normalizeTag,
} from '@/lib/posts'
import { FaCalendar, FaTags, FaClock } from 'react-icons/fa'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Sidebar from '@/components/Sidebar'
import Link from 'next/link'
import LikeButton from '@/app/blog/[slug]/LikeButton'
import { CtaBox } from '@/components/CtaBox'
import { AdSense } from '@/components/AdSense'

export const revalidate = 60

interface Props {
  params: { slug: string; postSlug: string }
}

export async function generateStaticParams() {
  const { getPostSlugsForSitemap } = await import('@/lib/posts')
  const posts = await getPostSlugsForSitemap()
  const withCategory = posts.filter((p) => p.categorySlug)
  return withCategory.map((p) => ({
    slug: p.categorySlug!,
    postSlug: p.slug,
  }))
}

export default async function CategoriaPostPage({ params }: Props) {
  const { slug: categorySlug, postSlug } = params

  const [post, { posts: categoryPosts }, tags] = await Promise.all([
    getPostByCategorySlugAndPostSlug(categorySlug, postSlug),
    getPostsByCategorySlug(categorySlug, { page: 1, limit: 500 }),
    getAllTags(),
  ])

  if (!post) notFound()

  const currentIndex = categoryPosts.findIndex((p) => p.slug === post.slug)
  const hasPrevious = currentIndex > 0
  const hasNext = currentIndex >= 0 && currentIndex < categoryPosts.length - 1
  const prevPost = hasPrevious ? categoryPosts[currentIndex - 1] : null
  const nextPost = hasNext ? categoryPosts[currentIndex + 1] : null

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://blog.pratuaqui.com.br'
  const postUrl = `${SITE_URL}/categoria/${categorySlug}/${post.slug}`

  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: SITE_URL },
      {
        '@type': 'ListItem',
        position: 2,
        name: post.categoryName ?? categorySlug,
        item: `${SITE_URL}/categoria/${categorySlug}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: postUrl,
      },
    ],
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description ?? undefined,
    image: post.coverImage ?? undefined,
    datePublished: post.date,
    dateModified: post.updatedAt ?? post.date,
    author: { '@type': 'Organization', name: 'Bolha Dev', url: SITE_URL },
    publisher: { '@type': 'Organization', name: 'Bolha Dev', url: SITE_URL },
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
    ...(post.tags?.length && { keywords: post.tags.join(', ') }),
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 sm:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Breadcrumb visual */}
      <nav className="mb-4 text-sm text-white/70" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <li>
            <Link href="/" className="hover:text-white transition-colors">
              Início
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href={`/categoria/${categorySlug}`}
              className="hover:text-white transition-colors"
            >
              {post.categoryName ?? categorySlug}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-white truncate max-w-[180px] sm:max-w-none" aria-current="page">
            {post.title}
          </li>
        </ol>
      </nav>

      <div className="flex flex-col lg:flex-row lg:gap-8">
        <main className="flex-1">
          <article className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10">
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="mb-6 flex justify-center">
                <AdSense adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP ?? ''} className="min-w-0" />
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-6">
                {post.title}
              </h1>

              <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center text-sm text-white/70 mb-6 sm:mb-8 gap-3 sm:gap-4">
                <span className="flex items-center">
                  <FaCalendar className="mr-2 flex-shrink-0" />
                  {new Date(post.date).toLocaleDateString('pt-BR')}
                </span>
                {post.updatedAt && (
                  <span className="flex items-center text-white/60">
                    Atualizado em {new Date(post.updatedAt).toLocaleDateString('pt-BR')}
                  </span>
                )}
                <span className="flex items-center">
                  <FaClock className="mr-2 flex-shrink-0" />
                  {post.readingTime.text}
                </span>
                {post.categoryName && (
                  <Link
                    href={`/categoria/${categorySlug}`}
                    className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-2 py-1 rounded text-xs font-medium transition-colors"
                  >
                    {post.categoryName}
                  </Link>
                )}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <FaTags className="mr-1 flex-shrink-0" />
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/blog/tag/${normalizeTag(tag)}`}
                        className="bg-white/10 hover:bg-white/20 text-white/90 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div
                className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-white prose-headings:text-white prose-a:text-blue-300 prose-strong:text-white prose-code:text-pink-300 prose-pre:bg-black/20 prose-blockquote:border-blue-400"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              <div className="mt-8 flex justify-center">
                <AdSense adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM ?? ''} className="min-w-0" />
              </div>

              <div className="mt-8">
                <CtaBox />
              </div>

              <div className="mt-8 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-400/20">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg font-semibold text-white mb-1">Gostou do post?</h3>
                    <p className="text-sm text-white/70">Deixe seu like e ajude a divulgar o conteúdo!</p>
                  </div>
                  <LikeButton postId={post.id.toString()} />
                </div>
              </div>
            </div>
          </article>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
            {prevPost && (
              <Link
                href={`/categoria/${categorySlug}/${prevPost.slug}`}
                className="group bg-white/10 hover:bg-white/20 text-white/90 px-4 sm:px-6 py-3 sm:py-4 rounded-lg transition-colors flex-1 sm:max-w-[48%]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg flex-shrink-0">←</span>
                  <div className="min-w-0 flex-1">
                    <small className="text-xs text-white/70">Post anterior</small>
                    <p className="font-medium text-sm group-hover:text-blue-300 transition-colors truncate">
                      {prevPost.title}
                    </p>
                  </div>
                </div>
              </Link>
            )}
            {nextPost && (
              <Link
                href={`/categoria/${categorySlug}/${nextPost.slug}`}
                className="group bg-white/10 hover:bg-white/20 text-white/90 px-4 sm:px-6 py-3 sm:py-4 rounded-lg transition-colors flex-1 sm:max-w-[48%] text-right"
              >
                <div className="flex items-center gap-2 justify-end">
                  <div className="min-w-0 flex-1 text-right">
                    <small className="text-xs text-white/70">Próximo post</small>
                    <p className="font-medium text-sm group-hover:text-blue-300 transition-colors truncate">
                      {nextPost.title}
                    </p>
                  </div>
                  <span className="text-lg flex-shrink-0">→</span>
                </div>
              </Link>
            )}
          </div>
        </main>

        <Sidebar
          recentPosts={categoryPosts
            .filter((p) => p.slug !== post.slug)
            .slice(0, 5)
            .map((p) => ({
              ...p,
              href: `/categoria/${categorySlug}/${p.slug}`,
            }))}
          tags={tags}
        />
      </div>
    </div>
  )
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://blog.pratuaqui.com.br'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostByCategorySlugAndPostSlug(params.slug, params.postSlug)
  if (!post) return { title: 'Post não encontrado' }

  const postUrl = `${SITE_URL}/categoria/${params.slug}/${params.postSlug}`

  return {
    title: post.title,
    description: post.description ?? undefined,
    keywords: post.tags?.length ? post.tags : undefined,
    authors: [{ name: 'Bolha Dev', url: SITE_URL }],
    creator: 'Bolha Dev',
    openGraph: {
      type: 'article',
      locale: 'pt_BR',
      url: postUrl,
      siteName: 'Bolha Dev',
      title: post.title,
      description: post.description ?? undefined,
      ...(post.coverImage && {
        images: [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description ?? undefined,
    },
    alternates: {
      canonical: postUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}
