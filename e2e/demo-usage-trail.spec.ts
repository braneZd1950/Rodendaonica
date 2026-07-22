import { test, expect } from '@playwright/test'
import {
  dismissConsentIfVisible,
  loginBusiness,
  loginParent,
  scene,
  scrollPage,
} from './helpers'

/**
 * Jedan kontinuirani prolaz kroz aplikaciju (~5 min video).
 * Pokreni: npm run e2e:demo
 * (prethodno: npm run dev ili neka playwright podigne server)
 */
test.describe('Rođendaonica — demo snimka', () => {
  test('demo korištenja aplikacije (~5 min)', async ({ page }) => {
    test.setTimeout(420_000)

    // —— Javni dio ——
    await page.goto('/')
    await dismissConsentIfVisible(page)
    await scene(page)
    await expect(page.locator('header')).toBeVisible()
    await scrollPage(page, 3)
    await scene(page)

    await page.getByRole('link', { name: 'Igraonice', exact: true }).first().click()
    await page.waitForURL(/\/igraonice\/?$/)
    await scene(page)
    await scrollPage(page, 2)

    const venueCard = page.locator('a[href*="/igraonice/"]').first()
    await venueCard.click()
    await page.waitForURL(/\/igraonice\//)
    await scene(page)
    await scrollPage(page, 3)

    await page.getByRole('link', { name: 'Kako funkcionira' }).first().click()
    await scene(page)
    await scrollPage(page, 2)

    await page.getByRole('link', { name: 'Cijene', exact: true }).first().click()
    await scene(page)
    await scrollPage(page, 2)

    await page.getByRole('link', { name: 'Rezerviraj termin' }).first().click()
    await page.waitForURL(/\/rezerviraj/)
    await scene(page)

    // Wizard korak 1 — igraonica
    await page.locator('.book-wizard-select__trigger').click()
    await page.getByRole('option').first().click()
    await scene(page, 4000)
    await page.getByRole('button', { name: 'Dalje' }).click()

    // Korak 2 — termin
    await scene(page, 4000)
    const dateInput = page.locator('#date')
    const futureDate = new Date()
    futureDate.setMonth(futureDate.getMonth() + 2)
    const iso = futureDate.toISOString().slice(0, 10)
    await dateInput.fill(iso)
    await page.locator('#time').selectOption({ index: 1 })
    await page.locator('#childName').fill('Luka')
    await page.locator('#guests').fill('14')
    await scene(page, 4000)
    await page.getByRole('button', { name: 'Dalje' }).click()

    // Korak 3 — sažetak (bez prijave samo pregled)
    await scene(page)
    await scrollPage(page, 2)
    await scene(page)

    // —— Roditelj ——
    await loginParent(page)
    await scene(page)

    await page.getByRole('link', { name: 'Profil' }).click()
    await page.waitForURL(/\/profil/)
    await scene(page)
    await scrollPage(page, 2)

    await page.getByRole('link', { name: 'Moje rezervacije' }).click()
    await page.waitForURL(/\/rezervacije/)
    await scene(page)
    await scrollPage(page, 2)

    await page.getByRole('link', { name: 'Poruke' }).click()
    await page.waitForURL(/\/poruke/)
    await scene(page, 6000)

    const thread = page.locator('.parent-messenger__thread').first()
    if (await thread.isVisible()) {
      await thread.click()
      await scene(page, 4000)
      const composer = page.getByPlaceholder('Napišite poruku igraonici...')
      await composer.fill('Pozdrav, potvrđujem termin — demo poruka.')
      await scene(page, 3000)
      await page.getByRole('button', { name: 'Pošalji' }).click()
      await scene(page)
    }

    await page.getByRole('link', { name: 'Rezerviraj termin', exact: true }).first().click()
    await page.waitForURL(/\/rezerviraj/)
    await scene(page)
    await page.getByRole('link', { name: 'Igraonice', exact: true }).first().click()
    await scene(page)

    await page.getByRole('link', { name: 'Odjava' }).click()
    await page.waitForURL(/\/(prijava)?\/?$/)
    await scene(page)

    // —— Igraonica ——
    await loginBusiness(page)
    await scene(page)

    await page.getByRole('link', { name: 'Dashboard' }).click()
    await page.waitForURL(/\/dashboard/)
    await scene(page)
    await scrollPage(page, 3)

    await page.getByRole('link', { name: 'Kalendar' }).click()
    await page.waitForURL(/\/kalendar/)
    await scene(page, 8000)

    await page.getByRole('link', { name: 'Rezervacije' }).click()
    await page.waitForURL(/\/poslovne-rezervacije/)
    await scene(page)
    await scrollPage(page, 2)

    await page.getByRole('link', { name: 'Poruke' }).click()
    await page.waitForURL(/\/poslovne-poruke/)
    await scene(page, 6000)

    await page.getByRole('link', { name: 'Recenzije' }).click()
    await page.waitForURL(/\/recenzije/)
    await scene(page, 6000)

    const replyBox = page.locator('textarea[id^="reply-"]').first()
    if (await replyBox.isVisible()) {
      await replyBox.fill('Hvala na povratnoj informaciji — demo odgovor igraonice.')
      await scene(page, 3000)
      await page.getByRole('button', { name: 'Objavi odgovor' }).first().click()
      await scene(page)
    }

    await page.getByRole('link', { name: 'Postavke' }).click()
    await page.waitForURL(/\/postavke-igraonice/)
    await scene(page)
    await scrollPage(page, 2)

    await page.getByRole('link', { name: 'Odjava' }).click()
    await scene(page)

    await page.goto('/')
    await scene(page)
    await scrollPage(page, 2)
    await scene(page)
  })
})
