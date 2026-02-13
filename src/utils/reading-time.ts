/**
 * Calcula o tempo estimado de leitura baseado no conteúdo
 * @param content - Conteúdo HTML ou texto do post
 * @returns Objeto com tempo em minutos e texto formatado
 * 
 * Regras:
 * - 200 palavras por minuto (padrão de leitura)
 * - Remove HTML antes de contar
 * - Conta palavras reais (sem espaços vazios)
 * - Arredonda sempre para cima
 * - Mínimo de 1 minuto
 * - Adiciona 12 segundos (0.2 min) por imagem
 */
export function calculateReadingTime(content: string): {
  minutes: number
  text: string
} {
  // Remove todas as tags HTML para contar apenas texto puro
  const textContent = content.replace(/<[^>]*>/g, '')
  
  // Conta palavras reais (split por espaços e filtra vazios)
  const words = textContent.trim().split(/\s+/).filter(word => word.length > 0)
  const wordCount = words.length
  
  // Conta imagens no HTML original
  const imageCount = (content.match(/<img[^>]*>/gi) || []).length
  
  // Calcula tempo base: 200 palavras por minuto
  const WORDS_PER_MINUTE = 200
  const readingMinutes = wordCount / WORDS_PER_MINUTE
  
  // Adiciona 12 segundos (0.2 minutos) por imagem
  const imageTime = imageCount * 0.2
  
  // Soma tudo e arredonda PARA CIMA
  let minutes = Math.ceil(readingMinutes + imageTime)
  
  // Garante mínimo de 1 minuto
  minutes = Math.max(minutes, 1)
  
  // Formata o texto de retorno
  let text: string
  if (minutes === 1) {
    text = '1 min de leitura'
  } else if (minutes < 60) {
    text = `${minutes} min de leitura`
  } else {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    if (remainingMinutes === 0) {
      text = `${hours}h de leitura`
    } else {
      text = `${hours}h ${remainingMinutes}min de leitura`
    }
  }
  
  return {
    minutes,
    text
  }
}

/**
 * Calcula estatísticas de leitura mais detalhadas
 * @param content - Conteúdo HTML ou texto do post
 * @returns Estatísticas detalhadas de leitura
 */
export function getReadingStats(content: string): {
  wordCount: number
  characterCount: number
  readingTime: {
    minutes: number
    text: string
  }
  estimatedParagraphs: number
  imageCount: number
  codeBlockCount: number
  headingCount: number
} {
  const textContent = content.replace(/<[^>]*>/g, '')
  const words = textContent.trim().split(/\s+/).filter(word => word.length > 0)
  const wordCount = words.length
  const characterCount = textContent.length
  
  // Análise do conteúdo
  const imageCount = (content.match(/<img[^>]*>/gi) || []).length
  const codeBlockCount = (content.match(/<pre[^>]*>[\s\S]*?<\/pre>/gi) || []).length
  const headingCount = (content.match(/<h[1-6][^>]*>/gi) || []).length
  
  // Estima parágrafos baseado em quebras de linha duplas
  const paragraphs = content.split(/<\/p>|<br\s*\/?>|\n\s*\n/).filter(p => p.trim().length > 0)
  const estimatedParagraphs = paragraphs.length
  
  const readingTime = calculateReadingTime(content)
  
  return {
    wordCount,
    characterCount,
    readingTime,
    estimatedParagraphs,
    imageCount,
    codeBlockCount,
    headingCount
  }
}
