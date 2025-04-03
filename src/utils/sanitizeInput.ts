export const sanitizeInput = (input: string): string => {
  return input
    .trim() // Remove leading/trailing spaces
    .replace(/</g, '&lt;') // Escape `<` to prevent HTML injection
    .replace(/>/g, '&gt;') // Escape `>`
    .replace(/"/g, '&quot;') // Escape `"`
    .replace(/'/g, '&#39;') // Escape `'`
    .replace(/&/g, '&amp;') // Escape `&`
    .replace(/`/g, '') // Remove backticks to prevent template literal injection
    .replace(/\\/g, '') // Remove backslashes to avoid escaping issues
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove ASCII control characters
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width spaces
    .replace(/<\/?[^>\s]+(?:\s[^>]*)?>/gi, '') // Remove HTML tags
    .replace(/(javascript|data|vbscript):/gi, '') // Remove dangerous URL schemes
    .replace(/on[a-z]+\s*=/gi, '') // Remove event handlers like `onerror=`
}

// Function to check if input contains only alphabets and numbers
export const isValidText = (input: string): boolean => {
  return /^[a-zA-Z0-9\s]+$/.test(input)
}
