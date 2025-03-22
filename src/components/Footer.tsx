'use client'

import Link from 'next/link'
import { FaGithub, FaLinkedin, FaYoutube } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-black/30 backdrop-blur-sm mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex space-x-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-blue-300 transition-colors"
            >
              <FaGithub size={24} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-blue-300 transition-colors"
            >
              <FaLinkedin size={24} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-blue-300 transition-colors"
            >
              <FaYoutube size={24} />
            </a>
          </div>
          <div className="text-center">
            <p className="text-white/60">
              {new Date().getFullYear()} Danilo Silva. Todos os direitos reservados.
            </p>
            <p className="text-white/40 text-sm mt-2">
              Desenvolvido com Next.js, TypeScript e Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
