import { getAllCategories } from '@/lib/categories'
import Link from 'next/link'

export const revalidate = 60

export const metadata = {
  title: 'Categorias | Bolha Dev',
  description: 'Navegue pelos temas do blog: SEO, Programação, Marketing Digital, Empreendedorismo e mais.',
}

export default async function CategoriasPage() {
  const categories = await getAllCategories()

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 flex items-center gap-2">
        <span className="w-10 h-0.5 bg-blue-400 rounded" />
        Categorias
      </h1>
      <p className="text-white/70 mb-8">
        Escolha uma categoria para ver todos os posts sobre o tema.
      </p>

      <ul className="grid gap-4 sm:grid-cols-2">
        {categories.map((cat) => (
          <li key={cat.id}>
            <Link
              href={`/categoria/${cat.slug}`}
              className="block p-4 sm:p-5 bg-white/10 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-white/15 hover:border-white/20 transition-colors"
            >
              <h2 className="text-lg font-semibold text-white mb-1">{cat.name}</h2>
              {cat.description && (
                <p className="text-sm text-white/70 line-clamp-2">{cat.description}</p>
              )}
              <span className="text-xs text-blue-300 mt-2 inline-block">
                Ver posts →
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {categories.length === 0 && (
        <p className="text-white/80 py-8">Nenhuma categoria cadastrada.</p>
      )}
    </div>
  )
}
