import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 - Página não encontrada | Bolha Dev',
  description: 'A página que você está procurando não existe. Volte para o início.',
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Número 404 grande e estilizado */}
        <div className="relative">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-pulse">
            404
          </h1>
          {/* Efeito de brilho atrás do 404 */}
          <div className="absolute inset-0 text-9xl font-bold text-blue-400/20 blur-sm animate-pulse">
            404
          </div>
        </div>

        {/* Mensagem personalizada */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white">
            Aqui é só mato! 🌿
          </h2>
          <p className="text-lg text-gray-300">
            A página que você está procurando se perdeu na floresta digital.
          </p>
          <p className="text-sm text-gray-400">
            Mas não se preocupe, vamos te ajudar a encontrar o caminho de volta!
          </p>
        </div>

        {/* Botões de ação */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out"
          >
            <span className="relative z-10">🏠 Voltar ao Início</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
          
          <Link
            href="/blog"
            className="group relative px-6 py-3 border-2 border-gray-300 text-gray-300 font-semibold rounded-lg hover:border-white hover:text-white transform hover:scale-105 transition-all duration-300 ease-in-out"
          >
            <span className="relative z-10">📝 Ver Blog</span>
          </Link>
        </div>

        {/* Elementos decorativos */}
        <div className="mt-12 space-y-4">
          {/* Ícones flutuantes */}
          <div className="flex justify-center space-x-8 opacity-60">
            <div className="text-2xl animate-bounce" style={{ animationDelay: '0s' }}>🌱</div>
            <div className="text-2xl animate-bounce" style={{ animationDelay: '0.2s' }}>🍃</div>
            <div className="text-2xl animate-bounce" style={{ animationDelay: '0.4s' }}>🌿</div>
            <div className="text-2xl animate-bounce" style={{ animationDelay: '0.6s' }}>🌾</div>
          </div>
          
          {/* Linha decorativa */}
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto"></div>
        </div>

        {/* Sugestões de páginas populares */}
        <div className="mt-8 text-left">
          <h3 className="text-lg font-semibold text-white mb-4">Talvez você esteja procurando por:</h3>
          <div className="space-y-2">
            <Link href="/blog" className="block text-blue-400 hover:text-blue-300 transition-colors duration-200">
              → Todos os posts do blog
            </Link>
            <Link href="/sobre" className="block text-blue-400 hover:text-blue-300 transition-colors duration-200">
              → Sobre mim
            </Link>
            <Link href="/" className="block text-blue-400 hover:text-blue-300 transition-colors duration-200">
              → Página inicial
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
