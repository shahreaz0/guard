export function generateRandomCode() {
  return Math.random().toString(36).slice(2, 10).toUpperCase()
}
