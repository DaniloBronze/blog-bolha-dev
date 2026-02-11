This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## SEO (Sitemap e robots)

O projeto gera automaticamente:

- **`/sitemap.xml`** – Sitemap dinâmico com home, `/blog`, `/sobre`, todos os posts e páginas de tag.
- **`/robots.txt`** – Permite indexação do site e aponta para o sitemap; bloqueia `/admin/` e `/api/auth/`.

Para produção, defina as URLs do blog e do produto:

```env
NEXT_PUBLIC_SITE_URL=https://blog.pratuaqui.com.br
NEXT_PUBLIC_PRODUTO_URL=https://pratuaqui.com.br
```

Assim, sitemap, robots e metadados (Open Graph, canonical) usarão a URL do blog. O CTA dos posts (componente **CtaBox**) aponta para `NEXT_PUBLIC_PRODUTO_URL`. Depois de publicar, cadastre `https://blog.pratuaqui.com.br/sitemap.xml` no Google Search Console.

### Google AdSense

Para exibir anúncios nos posts (`/blog/[slug]`), configure no `.env`:

```env
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_ADSENSE_SLOT_TOP=XXXXXXXXXX
NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM=XXXXXXXXXX
NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR=XXXXXXXXXX
```

O script do Google é carregado uma vez no layout (next/script). Um bloco aparece no topo do post e outro após o conteúdo.

### Estratégia Blog → Produto

O blog está configurado como **funil**: Conteúdo → Confiança → Intenção → Conversão. Cada post exibe um CTA para o PraTuAqui. A estratégia completa (tipos de post, estrutura que converte, métricas) está em **[docs/ESTRATEGIA-CONTEUDO.md](docs/ESTRATEGIA-CONTEUDO.md)**.

## Performance (ISR)

As páginas do blog usam **ISR** (Incremental Static Regeneration) para carregar rápido e evitar compilação sob demanda na Vercel:

- **Home** e **listagem /blog**: `revalidate = 60` (atualiza no máximo a cada 1 minuto).
- **Post individual** (`/blog/[slug]`): `revalidate = 300` (5 min) + `generateStaticParams` pré-renderiza todos os posts no **build**.
- **Páginas de tag** (`/blog/tag/[tag]`): `revalidate = 60`; tags já usam `generateStaticParams`.

No deploy, o `vercel-build` roda `prisma generate`, `prisma migrate deploy` e `next build`. É necessário que **`DATABASE_URL`** esteja definida nas variáveis de ambiente de **build** da Vercel para que `generateStaticParams` consiga buscar os slugs e pré-gerar as páginas. Novos posts publicados após o deploy são gerados na primeira visita e depois cacheados.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
