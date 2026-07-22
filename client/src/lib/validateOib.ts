export function normalizeOib(raw: string): string {
  return raw.replace(/\D/g, '')
}

export function isValidOib(oib: string): boolean {
  const digits = normalizeOib(oib)
  if (digits.length !== 11) return false

  let a = 10
  for (let i = 0; i < 10; i++) {
    a = (a + Number(digits[i])) % 10
    if (a === 0) a = 10
    a = (a * 2) % 11
  }
  const control = 11 - a
  const expected = control === 10 ? 0 : control
  return expected === Number(digits[10])
}
