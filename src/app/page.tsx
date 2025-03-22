import Link from 'next/link'
import { FaArrowRight, FaReact, FaNodeJs, FaDocker, FaGitAlt, FaPhp, FaAws, FaJs } from 'react-icons/fa'
import { SiNextdotjs, SiTypescript, SiTailwindcss, SiPostgresql } from 'react-icons/si'
import Sidebar from '@/components/Sidebar'
import { getRecentPosts } from '@/lib/posts'

export default async function Home() {
  const recentPosts = await getRecentPosts(3)

  const technologies = [
    { name: 'React', icon: FaReact, color: '#61DAFB' },
    { name: 'Next.js', icon: SiNextdotjs, color: '#000000' },
    { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
    { name: 'JavaScript', icon: FaJs, color: '#F7DF1E' },
    { name: 'Node.js', icon: FaNodeJs, color: '#339933' },
    { name: 'PHP', icon: FaPhp, color: '#777BB4' },
    { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4' },
    { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1' },
    { name: 'Docker', icon: FaDocker, color: '#2496ED' },
    { name: 'AWS', icon: FaAws, color: '#FF9900' },
    { name: 'Git', icon: FaGitAlt, color: '#F05032' }
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row lg:gap-8">
        <main className="flex-1">
          <section className="text-center py-12">
            <h1 className="text-5xl font-bold mb-6 text-white">
              Olá, eu sou <span className="text-blue-300">Danilo Silva</span>
            </h1>
            <p className="text-xl mb-8 text-white/80">
              Desenvolvedor Full Stack apaixonado por criar soluções inovadoras
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/blog"
                className="bg-blue-600/30 text-white px-6 py-3 rounded-lg hover:bg-blue-500/40 transition-colors flex items-center backdrop-blur-sm border border-blue-400/30"
              >
                Leia meu blog
                <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </section>

          <section className="mt-16">
            <h2 className="text-3xl font-bold text-white mb-6">Projetos Recentes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                <h3 className="text-xl font-bold text-white mb-2">Projeto 1</h3>
                <p className="text-white/70 mb-4">
                  Descrição breve do projeto e suas principais tecnologias.
                </p>
                <a
                  href="#"
                  className="text-blue-300 hover:text-blue-200 flex items-center"
                >
                  Ver projeto <FaArrowRight className="ml-2" />
                </a>
              </div>
              <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                <h3 className="text-xl font-bold text-white mb-2">Projeto 2</h3>
                <p className="text-white/70 mb-4">
                  Descrição breve do projeto e suas principais tecnologias.
                </p>
                <a
                  href="#"
                  className="text-blue-300 hover:text-blue-200 flex items-center"
                >
                  Ver projeto <FaArrowRight className="ml-2" />
                </a>
              </div>
            </div>
          </section>

          <section className="mt-16 mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Tecnologias</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {technologies.map((tech) => (
                <div
                  key={tech.name}
                  className="bg-white/10 p-6 rounded-lg backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors text-center group"
                >
                  <tech.icon 
                    className="w-12 h-12 mx-auto mb-3 transition-transform group-hover:scale-110" 
                    style={{ color: tech.color }}
                  />
                  <span className="text-white/90">{tech.name}</span>
                </div>
              ))}
            </div>
          </section>
        </main>

        <Sidebar recentPosts={recentPosts} />
      </div>
    </div>
  )
}
