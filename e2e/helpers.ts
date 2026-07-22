import type { Page } from '@playwright/test'

/** Pauza između scena — ukupno ~5 min u demo specu. */
export const SCENE_MS = 5_500

export async function scene(page: Page, ms: number = SCENE_MS) {
  await page.waitForTimeout(ms)
}

export async function dismissConsentIfVisible(page: Page) {
  const banner = page.locator('.consent-banner')
  if (!(await banner.isVisible().catch(() => false))) return

  await page.locator('label').filter({ hasText: 'Uvjete korištenja' }).click()
  await page.locator('label').filter({ hasText: 'Politiku privatnosti' }).click()
  await page.getByRole('button', { name: 'Prihvati sve' }).click()
  await banner.waitFor({ state: 'hidden', timeout: 10_000 }).catch(() => {})
}

export async function loginParent(page: Page) {
  await page.goto('/prijava')
  await dismissConsentIfVisible(page)
  await page.locator('#email').fill('ana.horvat@example.com')
  await page.locator('#password').fill('Test1234!')
  await page.locator('.auth-submit-btn').click()
  await page.waitForURL(/\/(profil|rezervacije)/, { timeout: 30_000 })
}

export async function loginBusiness(page: Page) {
  await page.goto('/prijava')
  await dismissConsentIfVisible(page)
  await page.locator('#email').fill('partner@igraonicasunce.hr')
  await page.locator('#password').fill('Test1234!')
  await page.locator('.auth-submit-btn').click()
  await page.waitForURL(/\/dashboard/, { timeout: 30_000 })
}

export async function scrollPage(page: Page, steps = 4) {
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, 500)
    await page.waitForTimeout(400)
  }
}
