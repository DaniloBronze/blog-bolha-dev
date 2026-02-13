import { Inter } from 'next/font/google'
import './globals.css'
import { SessionProvider } from '@/providers/SessionProvider'
import Navigation from '@/components/Navigation'
import { getAllCategories } from '@/lib/categories'

const inter = Inter({ subsets: ['latin'] })

const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID

import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://blog.pratuaqui.com.br'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Bolha Dev | Blog de programação e tecnologia',
    template: '%s | Bolha Dev',
  },
  description:
    'Blog sobre desenvolvimento, programação e tecnologia. Artigos, tutoriais e reflexões sobre PHP, Android, segurança e muito mais.',
  keywords: ['blog', 'programação', 'desenvolvimento', 'tecnologia', 'PHP', 'Android', 'dev'],
  authors: [{ name: 'Bolha Dev', url: SITE_URL }],
  creator: 'Bolha Dev',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: SITE_URL,
    siteName: 'Bolha Dev',
    title: 'Bolha Dev | Blog de programação e tecnologia',
    description: 'Blog sobre desenvolvimento, programação e tecnologia.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bolha Dev | Blog de programação e tecnologia',
    description: 'Blog sobre desenvolvimento, programação e tecnologia.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  manifest: '/manifest.json',
}

const jsonLdWebSite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Bolha Dev',
  description: 'Blog sobre desenvolvimento, programação e tecnologia.',
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/blog?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
}

const jsonLdOrganization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Bolha Dev',
  url: SITE_URL,
  description: 'Blog sobre desenvolvimento, programação e tecnologia.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const categories = await getAllCategories()

  return (
    <html lang="pt-BR">
      <head>
        {ADSENSE_CLIENT_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className={`${inter.className} min-h-screen bg-gray-900`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
        <SessionProvider>
          <Navigation categories={categories} />
            {children}
        </SessionProvider>
      </body>
    </html>
  )
}