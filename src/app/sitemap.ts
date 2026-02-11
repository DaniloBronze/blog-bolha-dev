import { MetadataRoute } from 'next'
import { getPostSlugsForSitemap, getAllTags } from '@/lib/posts'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://blog.pratuaqui.com.br'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, tags] = await Promise.all([
    getPostSlugsForSitemap(),
    getAllTags(),
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
      url: `${BASE_URL}/sobre`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]

  const postPages: MetadataRoute.Sitemap = posts.map(({ slug, publishedAt }) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: publishedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const tagPages: MetadataRoute.Sitemap = tags.map((tag) => ({
    url: `${BASE_URL}/blog/tag/${tag}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }))

  return [...staticPages, ...postPages, ...tagPages]
}
