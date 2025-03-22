import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: 'rgba(255, 255, 255, 0.9)',
            h1: {
              color: 'white',
              fontWeight: '700',
            },
            h2: {
              color: 'white',
              fontWeight: '700',
            },
            h3: {
              color: 'white',
              fontWeight: '700',
            },
            h4: {
              color: 'white',
              fontWeight: '700',
            },
            strong: {
              color: 'white',
            },
            a: {
              color: '#93c5fd',
              '&:hover': {
                color: '#60a5fa',
              },
            },
            code: {
              color: '#93c5fd',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              padding: '0.2em 0.4em',
              borderRadius: '0.375rem',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            blockquote: {
              color: 'rgba(255, 255, 255, 0.7)',
              borderLeftColor: '#60a5fa',
            },
            ul: {
              color: 'rgba(255, 255, 255, 0.9)',
            },
            ol: {
              color: 'rgba(255, 255, 255, 0.9)',
            },
            li: {
              color: 'rgba(255, 255, 255, 0.9)',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config
