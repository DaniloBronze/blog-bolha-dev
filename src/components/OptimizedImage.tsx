import { optimizeCloudinaryImage } from '@/utils/cloudinary-optimizer'

interface OptimizedImageProps {
  src: string | null | undefined
  alt: string
  width: number
  height?: number
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: boolean
}

/**
 * Componente de imagem otimizada que automaticamente aplica transformações do Cloudinary
 * 
 * Benefícios:
 * - Formato moderno (WebP/AVIF) automaticamente
 * - Tamanho correto para o contexto (reduz bandwidth)
 * - Lazy loading por padrão
 * - Fallback para imagem original se não for Cloudinary
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  priority = false,
}: OptimizedImageProps) {
  if (!src) return null

  const optimizedSrc = optimizeCloudinaryImage(src, width, height) || src

  return (
    <img
      src={optimizedSrc}
      alt={alt}
      loading={priority ? 'eager' : loading}
      className={className}
      width={width}
      height={height}
    />
  )
}
