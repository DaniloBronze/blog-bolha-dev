'use client'

import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

const AD_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID

export interface AdSenseProps {
  /** ID do slot do anúncio (ex.: "1234567890") */
  adSlot: string
  /** Formato do anúncio: auto, rectangle, horizontal, vertical */
  adFormat?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
  /** Client AdSense (opcional; usa NEXT_PUBLIC_ADSENSE_CLIENT_ID se não informado) */
  adClient?: string
  /** Classe CSS no container */
  className?: string
  /** Estilo do container (ex.: minHeight para reservar espaço) */
  style?: React.CSSProperties
}

/**
 * Bloco de anúncio Google AdSense.
 * Evita hydration: renderiza o ins apenas no client e dispara push() após montar.
 * O script do Google deve ser carregado uma vez no layout (ex.: root layout) via next/script.
 */
export function AdSense({
  adSlot,
  adFormat = 'auto',
  adClient = AD_CLIENT,
  className = '',
  style,
}: AdSenseProps) {
  const [mounted, setMounted] = useState(false)
  const insRef = useRef<HTMLModElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !adClient || !adSlot) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {
      console.warn('AdSense push error:', e)
    }
  }, [mounted, adClient, adSlot])

  if (!adClient || !adSlot) {
    return null
  }

  const placeholderStyle: React.CSSProperties = {
    minHeight: 90,
    ...style,
  }

  if (!mounted) {
    return (
      <div
        className={`adsense-placeholder ${className}`.trim()}
        style={placeholderStyle}
        aria-hidden
      />
    )
  }

  return (
    <div className={className.trim() || undefined} style={style}>
      <ins
        ref={insRef}
        className="adsbygoogle"
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
        style={{ display: 'block', minHeight: 90 }}
      />
    </div>
  )
}
