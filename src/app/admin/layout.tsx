'use client'
import { usePathname, redirect } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { FaNewspaper, FaComments, FaChartBar, FaSignOutAlt, FaFolder } from 'react-icons/fa'
import { signOut } from 'next-auth/react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  // Se estiver na página de login, não aplica layout
  if (pathname === '/admin/login') {
    return <>{children}</>
  }
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/admin/login')
    },
  })


  return (
    <div className="min-h-screen flex bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white/5 backdrop-blur-sm border-r border-white/10">
        <div className="h-16 flex items-center px-8 border-b border-white/10">
          <h1 className="text-white font-semibold text-lg">Painel Admin</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/admin/dashboard"
                className="flex items-center p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-colors"
              >
                <FaNewspaper className="mr-2" />
                Posts
              </Link>
            </li>
            <li>
              <Link
                href="/admin/categorias"
                className="flex items-center p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-colors"
              >
                <FaFolder className="mr-2" />
                Categorias
              </Link>
            </li>
            <li>
              <Link
                href="/admin/comments"
                className="flex items-center p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-colors"
              >
                <FaComments className="mr-2" />
                Comentários
              </Link>
            </li>
            <li>
              <Link
                href="/admin/stats"
                className="flex items-center p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-colors"
              >
                <FaChartBar className="mr-2" />
                Estatísticas
              </Link>
            </li>
            <li>
              <button
                onClick={() => signOut({ callbackUrl: '/admin/login' })}
                className="w-full flex items-center p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-colors"
              >
                <FaSignOutAlt className="mr-2" />
                Sair
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1">
        <div className="h-16 bg-white/5 backdrop-blur-sm border-b border-white/10 flex items-center px-8">
          <div className="text-white/80">
            Bem-vindo, <span className="font-medium text-white">{session?.user?.name}</span>
          </div>
        </div>
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}