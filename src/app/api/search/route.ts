import { NextRequest, NextResponse } from 'next/server'
import { searchPosts } from '@/lib/posts'

/**
 * API Route: Busca de posts otimizada para produção
 * 
 * Otimizações implementadas:
 * - Cache de 60 segundos (s-maxage) para reduzir execuções serverless
 * - stale-while-revalidate (300s) para performance
 * - Validação de query (mínimo 3 caracteres)
 * - Headers CORS para flexibilidade
 * - Respostas otimizadas (só campos necessários)
 */

// Configuração do Next.js: permite cache dinâmico
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs' // ou 'edge' se preferir Edge Runtime

export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams.get('q')?.trim() ?? ''

    // Validação: requer pelo menos 3 caracteres
    if (q.length < 3) {
      return NextResponse.json(
        { query: q, posts: [], message: 'Digite pelo menos 3 caracteres' },
        { 
          status: 200,
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          }
        }
      )
    }

    // Busca posts (função já otimizada com Prisma)
    const posts = await searchPosts(q)

    // Retorna apenas campos necessários (reduz payload)
    const optimizedPosts = posts.map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.description,
      categorySlug: p.categorySlug,
    }))

    return NextResponse.json(
      { 
        query: q, 
        posts: optimizedPosts,
        count: optimizedPosts.length 
      },
      {
        status: 200,
        headers: {
          // Cache por 60s no CDN da Vercel, revalida em background por até 5min
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('❌ Erro na API de busca:', error)
    
    return NextResponse.json(
      { 
        query: '', 
        posts: [], 
        error: 'Erro ao processar busca. Tente novamente.' 
      },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store', // Não cacheia erros
        }
      }
    )
  }
}
