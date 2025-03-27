export function isTyping(): boolean {
  const tag = document.activeElement?.tagName.toLowerCase()
  return ['input', 'textarea'].includes(tag || '')
}
