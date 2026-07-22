export function mockDelay(ms = 260) {
  return new Promise<void>(resolve => setTimeout(resolve, ms))
}
