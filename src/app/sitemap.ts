import { MetadataRoute } from 'next'
import { getPostSlugsForSitemap, getAllTags } from '@/lib/posts'
import { getCategoryIdsForSitemap } from '@/lib/categories'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://blog.pratuaqui.com.br'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, tags, categories] = await Promise.all([
    getPostSlugsForSitemap(),
    getAllTags(),
    getCategoryIdsForSitemap(),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/categorias`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/sobre`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/busca`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/tags`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ]

  const categoryPages: MetadataRoute.Sitemap = categories.map(({ slug }) => ({
    url: `${BASE_URL}/categoria/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const postPages: MetadataRoute.Sitemap = posts.map(
    ({ slug, categorySlug, updatedAt }) => ({
      url: categorySlug
        ? `${BASE_URL}/categoria/${categorySlug}/${slug}`
        : `${BASE_URL}/blog/${slug}`,
      lastModified: updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })
  )

  const tagPages: MetadataRoute.Sitemap = tags.map((tag) => ({
    url: `${BASE_URL}/blog/tag/${tag}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }))

  return [...staticPages, ...categoryPages, ...postPages, ...tagPages]
}
