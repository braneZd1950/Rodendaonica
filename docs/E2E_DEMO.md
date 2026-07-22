# Playwright demo snimka (~5 min)

Automatski prolaz kroz aplikaciju s **video zapisom** (registracija, prijava, rezervacije, poruke, dashboard…).

## Priprema (jednom)

```bash
npm install
npm run e2e:install
```

## Snimanje

**Terminal 1** — aplikacija (ako već ne radi):

```bash
npm run dev
```

**Terminal 2** — demo + video:

```bash
npm run e2e:demo
```

Ili s vidljivim browserom:

```bash
npm run e2e:demo:headed
```

## Gdje je video?

Nakon testa:

```
e2e-results/demo-usage-trail-...-chromium/video.webm
```

Najnoviji folder pod `e2e-results/` sadrži `video.webm`. HTML izvještaj: `playwright-report/index.html`.

## Demo računi (mock ili seed)

| Uloga | Email | Lozinka |
|-------|-------|---------|
| Roditelj | ana.horvat@example.com | Test1234! |
| Igraonica | partner@igraonicasunce.hr | Test1234! |

## Napomene

- Test traje **~4–6 min** (namjerno usporene pauze radi preglednog videa).
- Koristi `reuseExistingServer` — možeš imati već pokrenut `npm run dev`.
- Za HTTP backend: `client/.env.local` s `VITE_API_MODE=http` i seed bazu prije snimanja.
