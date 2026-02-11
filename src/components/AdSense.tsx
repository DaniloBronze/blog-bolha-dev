'use client'

import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

const AD_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID
const IS_PRODUCTION = process.env.NODE_ENV === 'production'

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
 * Bloco de anúncio Google AdSense (client-safe).
 * - Só executa push() quando o container tem largura > 0 (evita availableWidth=0).
 * - Não executa em desenvolvimento (NODE_ENV !== 'production').
 * - Script deve estar no <head> do layout (sem next/script).
 */
export function AdSense({
  adSlot,
  adFormat = 'auto',
  adClient = AD_CLIENT,
  className = '',
  style,
}: AdSenseProps) {
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const pushDoneRef = useRef(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !adClient || !adSlot || !IS_PRODUCTION) return
    if (pushDoneRef.current) return

    const container = containerRef.current
    if (!container) return

    const tryPush = () => {
      if (pushDoneRef.current) return
      try {
        if (typeof window === 'undefined' || !window.adsbygoogle) return
        if (container.offsetWidth <= 0) return
        pushDoneRef.current = true
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (e) {
        console.warn('AdSense push error:', e)
      }
    }

    tryPush()
    if (container.offsetWidth <= 0) {
      const ro = new ResizeObserver(() => {
        if (container.offsetWidth > 0) tryPush()
      })
      ro.observe(container)
      return () => ro.disconnect()
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
        style={{ ...placeholderStyle, width: '100%' }}
        aria-hidden
      />
    )
  }

  return (
    <div
      ref={containerRef}
      className={className.trim() || undefined}
      style={{ width: '100%', ...style }}
    >
      <ins
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
