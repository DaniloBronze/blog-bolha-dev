/**
 * Gera um fingerprint único para o usuário baseado em características do navegador
 * Combina: user agent, timezone, idioma, resolução da tela, e outras características
 */
export function generateFingerprint(): string {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  // Informações básicas do navegador
  const userAgent = navigator.userAgent
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const language = navigator.language
  const platform = navigator.platform
  
  // Informações da tela
  const screenWidth = screen.width
  const screenHeight = screen.height
  const colorDepth = screen.colorDepth
  const pixelRatio = window.devicePixelRatio
  
  // Informações de hardware (se disponível)
  const hardwareConcurrency = navigator.hardwareConcurrency || 0
  const maxTouchPoints = navigator.maxTouchPoints || 0
  
  // Canvas fingerprint (mais único)
  if (ctx) {
    ctx.textBaseline = 'top'
    ctx.font = '14px Arial'
    ctx.fillText('Fingerprint canvas', 2, 2)
  }
  const canvasData = canvas.toDataURL()
  
  // WebGL fingerprint (se disponível)
  let webglFingerprint = ''
  try {
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (gl) {
      const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info')
      if (debugInfo) {
        webglFingerprint = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || ''
      }
    }
  } catch (e) {
    // WebGL não disponível
  }
  
  // Combina todas as informações
  const fingerprintData = [
    userAgent,
    timezone,
    language,
    platform,
    screenWidth,
    screenHeight,
    colorDepth,
    pixelRatio,
    hardwareConcurrency,
    maxTouchPoints,
    canvasData,
    webglFingerprint,
    // Adiciona timestamp para tornar único por sessão
    Date.now().toString()
  ].join('|')
  
  // Gera hash simples (em produção, use uma biblioteca como crypto-js)
  return btoa(fingerprintData).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32)
}

/**
 * Armazena o fingerprint no localStorage para reutilização
 */
export function getOrCreateFingerprint(): string {
  const STORAGE_KEY = 'user_fingerprint'
  
  try {
    let fingerprint = localStorage.getItem(STORAGE_KEY)
    
    if (!fingerprint) {
      fingerprint = generateFingerprint()
      localStorage.setItem(STORAGE_KEY, fingerprint)
    }
    
    return fingerprint
  } catch (error) {
    // Fallback se localStorage não estiver disponível
    return generateFingerprint()
  }
}
