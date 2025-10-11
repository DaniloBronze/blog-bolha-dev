import Link from 'next/link'
import { FaArrowRight, FaReact, FaNodeJs, FaDocker, FaGitAlt, FaPhp, FaAws, FaJs, FaGithub, FaLinkedin, FaEnvelope, FaYoutube } from 'react-icons/fa'
import { SiNextdotjs, SiTypescript, SiTailwindcss, SiPostgresql } from 'react-icons/si'

export default function About() {
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

  const projects = [
    {
      title: 'Sistema de E-commerce',
      description: 'Plataforma completa de e-commerce com React, Node.js e PostgreSQL. Inclui sistema de pagamentos, gestão de estoque e painel administrativo.',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
      link: '#'
    },
    {
      title: 'API REST com TypeScript',
      description: 'API robusta desenvolvida com TypeScript, Express e Prisma. Implementa autenticação JWT, validação de dados e documentação automática.',
      technologies: ['TypeScript', 'Express', 'Prisma', 'JWT'],
      link: '#'
    },
    {
      title: 'Dashboard Analytics',
      description: 'Dashboard interativo para análise de dados com gráficos em tempo real, filtros avançados e exportação de relatórios.',
      technologies: ['Next.js', 'Chart.js', 'Tailwind CSS', 'Docker'],
      link: '#'
    }
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-blue-300 hover:text-blue-200 transition-colors mb-6"
        >
          ← Voltar ao blog
        </Link>
        
        <h1 className="text-4xl font-bold text-white mb-4">
          Olá, eu sou <span className="text-blue-300">Danilo Silva</span>
        </h1>
        <p className="text-xl text-white/80 mb-8">
          Desenvolvedor Full Stack
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Sobre mim</h2>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/10">
          <p className="text-white/80 mb-4">
            Estudante e amante de desenvolvimento desde os 13 anos, me especializei em 
            sistemas legados e me tornei especialista em PHP. Atualmente trabalho como 
            Desenvolvedor Fullstack. Além disso, também crio conteúdos aqui no blog e no 
            meu canal do <a href="https://youtube.com/@BolhaDev" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 transition-colors">YouTube</a>.
          </p>
          <p className="text-white/80">
            Apaixonado por boas práticas de desenvolvimento, princípios SOLID, Design Patterns 
            e clean code. Sempre busco escrever código de qualidade e acredito na filosofia: 
            <em className="text-blue-300"> "Deixe o código melhor do que você o encontrou"</em>
          </p>
        </div>
      </section>

      {/* <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Projetos</h2>
        <div className="space-y-6">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:bg-white/20 transition-colors"
            >
              <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
              <p className="text-white/70 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="bg-blue-600/30 text-blue-300 px-3 py-1 rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <a
                href={project.link}
                className="text-blue-300 hover:text-blue-200 flex items-center"
              >
                Ver projeto <FaArrowRight className="ml-2" />
              </a>
            </div>
          ))}
        </div>
      </section> */}

      {/* <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Tecnologias</h2>
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
      </section> */}

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Contato</h2>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/10">
          <p className="text-white/80 mb-6">
            Tem alguma pergunta? 
            Entre em contato comigo através dos canais abaixo:
          </p>
           <div className="flex flex-wrap gap-4">
             <a
               href="https://github.com/DaniloBronze"
               target="_blank"
               rel="noopener noreferrer"
               className="flex items-center text-blue-300 hover:text-blue-200 transition-colors"
             >
               <FaGithub className="mr-2" />
               GitHub
             </a>
             <a
               href="https://linkedin.com/in/danilo-silva-70ab24253/"
               target="_blank"
               rel="noopener noreferrer"
               className="flex items-center text-blue-300 hover:text-blue-200 transition-colors"
             >
               <FaLinkedin className="mr-2" />
               LinkedIn
             </a>
             <a
               href="https://youtube.com/@BolhaDev"
               target="_blank"
               rel="noopener noreferrer"
               className="flex items-center text-blue-300 hover:text-blue-200 transition-colors"
             >
               <FaYoutube className="mr-2" />
               YouTube
             </a>
           </div>
        </div>
      </section>
    </div>
  )
}
