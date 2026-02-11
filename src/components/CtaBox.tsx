import Link from 'next/link'

const PRODUTO_URL = process.env.NEXT_PUBLIC_PRODUTO_URL ?? 'https://pratuaqui.com.br'

export interface CtaBoxProps {
  /** Título do CTA (ex.: "Venda seus produtos mais rápido") */
  title?: string
  /** Descrição curta (ex.: "Use o PraTuAqui para acelerar suas vendas com tecnologia.") */
  description?: string
  /** Texto do botão – variar por post aumenta conversão (ex.: "Vender estoque parado com o PraTuAqui") */
  buttonText?: string
  /** URL de destino. Padrão: site do produto. */
  href?: string
  /** Classe CSS adicional no container */
  className?: string
}

const defaults = {
  title: 'Venda seus produtos mais rápido',
  description: 'Use o PraTuAqui para acelerar suas vendas com tecnologia.',
  buttonText: 'Testar o PraTuAqui',
}

export function CtaBox({
  title = defaults.title,
  description = defaults.description,
  buttonText = defaults.buttonText,
  href = PRODUTO_URL,
  className = '',
}: CtaBoxProps) {
  return (
    <div
      className={`border border-white/20 rounded-xl p-6 bg-neutral-900/80 backdrop-blur-sm ${className}`}
    >
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-white/80 text-sm mb-4">{description}</p>
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors"
      >
        {buttonText}
      </Link>
    </div>
  )
}
