/**
 * Otimiza URL do Cloudinary com transformações para performance
 * 
 * Aplica automaticamente:
 * - f_auto: formato moderno (WebP/AVIF)
 * - q_auto: qualidade automática
 * - w_[size]: redimensiona para largura apropriada
 * - c_fill: crop/fill mantendo aspect ratio
 * - dpr_auto: device pixel ratio automático
 * 
 * @param url - URL original do Cloudinary
 * @param width - Largura desejada em pixels (padrão: 800)
 * @param height - Altura desejada em pixels (opcional)
 * @returns URL otimizada ou URL original se não for Cloudinary
 * 
 * Exemplo:
 * Input:  https://res.cloudinary.com/abc/image/upload/v123/folder/image.png
 * Output: https://res.cloudinary.com/abc/image/upload/f_auto,q_auto:good,w_800,c_limit,dpr_auto/v123/folder/image.png
 */
export function optimizeCloudinaryImage(
  url: string | null | undefined,
  width: number = 800,
  height?: number
): string | null {
  if (!url) return null
  
  // Verifica se é URL do Cloudinary
  if (!url.includes('res.cloudinary.com')) {
    return url
  }

  // Padrão de URL do Cloudinary: 
  // https://res.cloudinary.com/[cloud]/image/upload/v[version]/[folder]/[id].[ext]
  const uploadIndex = url.indexOf('/upload/')
  if (uploadIndex === -1) return url

  // Constrói as transformações
  const transforms: string[] = [
    'f_auto',           // Formato automático (WebP/AVIF)
    'q_auto:good',      // Qualidade automática (good balance)
    `w_${width}`,       // Largura
  ]

  if (height) {
    transforms.push(`h_${height}`)
    transforms.push('c_fill')  // Crop/fill para manter aspect ratio
  } else {
    transforms.push('c_limit')  // Limita largura mantendo proporção
  }

  transforms.push('dpr_auto')  // Device pixel ratio automático

  const transformString = transforms.join(',')

  // Insere as transformações após /upload/
  const optimizedUrl = url.replace(
    '/upload/',
    `/upload/${transformString}/`
  )

  return optimizedUrl
}
