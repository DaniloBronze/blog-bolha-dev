interface SearchFormProps {
  defaultValue?: string
  className?: string
}

export default function SearchForm({ defaultValue = '', className = '' }: SearchFormProps) {
  return (
    <form action="/busca" method="get" className={className}>
      <div className="flex gap-2 flex-wrap">
        <input
          type="search"
          name="q"
          defaultValue={defaultValue}
          placeholder="Ex: React, API, vendas..."
          className="flex-1 min-w-[200px] px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Termo de pesquisa"
        />
        <button
          type="submit"
          className="px-5 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors shrink-0"
        >
          Pesquisar
        </button>
      </div>
    </form>
  )
}
