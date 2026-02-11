/**
 * Extrai URLs de imagens do conteúdo do post (markdown e HTML).
 * Útil para permitir escolher "imagem principal" entre as já usadas no post.
 */
export function extractImageUrlsFromContent(content: string): string[] {
  if (!content || typeof content !== 'string') return []

  const urls: string[] = []

  // Markdown: ![alt](url) ou ![](url)
  const markdownRegex = /!\[[^\]]*\]\s*\(\s*(https?:\/\/[^\s)]+)\s*\)/gi
  let match
  while ((match = markdownRegex.exec(content)) !== null) {
    const url = match[1].trim()
    if (url && !urls.includes(url)) urls.push(url)
  }

  // HTML: <img src="url" ...> ou <img src='url' ...>
  const htmlRegex = /<img[^>]+src\s*=\s*["']([^"']+)["']/gi
  while ((match = htmlRegex.exec(content)) !== null) {
    const url = match[1].trim()
    if (url && !urls.includes(url)) urls.push(url)
  }

  return urls
}
