/**
 * Calcula o tempo estimado de leitura baseado no conteúdo
 * @param content - Conteúdo HTML ou texto do post
 * @returns Objeto com tempo em minutos e texto formatado
 */
export function calculateReadingTime(content: string): {
  minutes: number
  text: string
} {
  const textContent = content.replace(/<[^>]*>/g, '')
  
  // Conta palavras (considerando espaços e quebras de linha)
  const words = textContent.trim().split(/\s+/).filter(word => word.length > 0)
  const wordCount = words.length
  
  // Análise adicional do conteúdo
  const imageCount = (content.match(/<img[^>]*>/gi) || []).length
  const codeBlockCount = (content.match(/<pre[^>]*>[\s\S]*?<\/pre>/gi) || []).length
  const headingCount = (content.match(/<h[1-6][^>]*>/gi) || []).length
  
  // Velocidade de leitura mais realista: 150 palavras por minuto
  // (200 é muito otimista para leitura de conteúdo técnico)
  let wordsPerMinute = 150
  
  // Ajustes baseados no tipo de conteúdo
  if (codeBlockCount > 0) {
    // Código requer mais tempo para entender
    wordsPerMinute = 120
  }
  
  if (headingCount > 5) {
    // Muitos títulos indicam conteúdo estruturado que pode ser lido mais rápido
    wordsPerMinute = Math.min(wordsPerMinute + 20, 180)
  }
  
  // Tempo baseado em palavras
  let minutes = Math.ceil(wordCount / wordsPerMinute)
  
  // Adiciona tempo para imagens (30 segundos por imagem)
  const imageTime = Math.ceil(imageCount * 0.5)
  minutes += imageTime
  
  // Adiciona tempo para blocos de código (1 minuto por bloco)
  const codeTime = codeBlockCount
  minutes += codeTime
  
  // Garante um tempo mínimo de 1 minuto
  minutes = Math.max(minutes, 1)
  
  // Formata o texto baseado no tempo
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
