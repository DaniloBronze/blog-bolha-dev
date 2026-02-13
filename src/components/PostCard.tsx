import Link from 'next/link'

const TAG_COLORS = [
  'text-emerald-400 border-emerald-400/50', // verde
  'text-amber-400 border-amber-400/50',     // laranja
  'text-blue-400 border-blue-400/50',      // azul
]

function getTagColor(index: number) {
  return TAG_COLORS[index % TAG_COLORS.length]
}

/** Gera um gradiente estável por slug (para thumbnail placeholder). */
function placeholderGradient(slug: string) {
  const n = slug.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const hues = ['from-blue-900/80 to-indigo-900/80', 'from-slate-800/80 to-blue-800/80', 'from-violet-900/80 to-slate-800/80']
  return hues[n % hues.length]
}

export interface PostCardProps {
  slug: string
  title: string
  description: string
  tags: string[]
  date: string
  readingTime: string
  /** URL da imagem principal do post (capa). Se não houver, usa placeholder. */
  coverImage?: string | null
  /** Índice para cor da tag (alterna verde/laranja/azul) */
  tagColorIndex?: number
  /** Se true, layout horizontal (imagem à esquerda, texto à direita), estilo "Mais recentes" */
  horizontal?: boolean
  /** Badge opcional, ex: "Agora mesmo" */
  badge?: string
  /** Link do post. Se não informado, usa /blog/[slug]. Use ex: /categoria/seo/post-slug para URL hierárquica. */
  href?: string
}

export default function PostCard({
  slug,
  title,
  description,
  tags,
  date,
  readingTime,
  coverImage = null,
  tagColorIndex = 0,
  horizontal = false,
  badge,
  href,
}: PostCardProps) {
  const tagColor = getTagColor(tagColorIndex)
  const firstTag = tags[0]
  const linkHref = href ?? `/blog/${slug}`

  const thumbClass = `relative flex-shrink-0 overflow-hidden ${horizontal ? 'w-full h-40 rounded-t-xl sm:w-44 sm:h-44 sm:rounded-t-none sm:rounded-l-xl' : 'w-full h-40 rounded-t-xl'} ${!coverImage ? placeholderGradient(slug) : 'bg-neutral-800'}`

  const content = (
    <>
      <div className={thumbClass}>
        {coverImage ? (
          <img
            src={coverImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        ) : null}
        {badge && (
          <span className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded uppercase font-medium">
            {badge}
          </span>
        )}
      </div>
      <div className={horizontal ? 'flex-1 min-w-0 p-4 sm:p-5' : 'p-4'}>
        {firstTag && (
          <span className={`text-xs font-medium uppercase tracking-wide border rounded px-2 py-0.5 ${tagColor}`}>
            {firstTag}
          </span>
        )}
        <h2 className="mt-2 text-lg sm:text-xl font-bold text-white line-clamp-2 hover:text-blue-300 transition-colors">
          {title}
        </h2>
        <p className="mt-1 text-sm text-white/70 line-clamp-2">
          {description}
        </p>
        {horizontal && (
          <div className="mt-2 text-xs text-white/50">
            {new Date(date).toLocaleDateString('pt-BR')} · {readingTime}
          </div>
        )}
      </div>
    </>
  )

  if (horizontal) {
    return (
      <article className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:bg-white/15 hover:border-white/20 transition-all duration-200 shadow-lg shadow-black/10 flex flex-col sm:flex-row group">
        <Link href={linkHref} className="contents">
          {content}
        </Link>
      </article>
    )
  }

  return (
    <article className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:bg-white/15 hover:border-white/20 transition-all duration-200 shadow-lg shadow-black/10 group">
      <Link href={linkHref} className="block">
        {content}
      </Link>
    </article>
  )
}
