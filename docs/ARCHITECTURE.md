# Rođendaonica — arhitektura frontenda

## Pregled

Frontend je **React 19 + Vite + TypeScript** SPA s jasnom podjelom:

- **Produkcijski kod** — `api/`, `types/`, `services/`, `pages/`, `components/`
- **Development mock** — `mock/` (izoliran, ne uvozi se iz UI-a direktno)
- **Statički sadržaj** — `content/` (marketing tekstovi, cijene)

```
src/
  types/              # Domenski tipovi
  config/             # env.ts, app.ts
  constants/          # routes.ts, events.ts
  api/
    contracts/        # TypeScript sučelja
    client/           # httpClient (produkcija)
    implementations/http/
    index.ts          # export const api
  mock/               # SAMO development
  services/           # authService fasada
  hooks/              # useAsyncData
  lib/                # format, errors, logger, consent
  content/            # businessPlans, …
  pages/
  components/
```

## Pravilo ovisnosti

```
pages → api | services → (mock | http)
mock ↛ pages   (zabranjeno direktno)
```

## Okruženja

| Varijabla | Development | Produkcija |
|-----------|-------------|------------|
| `VITE_API_MODE` | `mock` | `http` |
| `VITE_API_BASE_URL` | `http://localhost:3000/api` | produkcijski API |
| `VITE_APP_VERSION` | `0.1.0` | iz CI |

## Cross-cutting

| Komponenta | Svrha |
|------------|--------|
| `ErrorBoundary` | Hvata React crash |
| `DevModeBanner` | Prikaz mock moda u dev-u |
| `AUTH_UNAUTHORIZED_EVENT` | 401 → redirect na prijavu |
| `useAsyncData` | Učitavanje + error + reload |
| `lib/format.ts` | HR labeli, datumi, EUR |

## Uloge i rute

| Uloga | Zaštićene rute |
|-------|----------------|
| Roditelj | `/profil`, `/rezervacije`, `/poruke` |
| Igraonica | `/dashboard`, `/kalendar`, `/poslovne-*`, `/recenzije`, `/postavke-igraonice` |

## Prijelaz na backend

1. Implementirajte [API.md](./API.md)
2. Deploy frontenda s `VITE_API_MODE=http`
3. UI ostaje isti

## Checklist nove domene

- [ ] `types/`
- [ ] `api/contracts/`
- [ ] `mock/data/*.seed.ts` + `createMockApi`
- [ ] `createHttpApi`
- [ ] Stranica s `useAsyncData`
- [ ] Dokumentirati endpoint u `API.md`

Primjer implementirane domene: **katalog igraonica (Faza A)** — vidi [MVP_STATUS_AND_CATALOG.md](./MVP_STATUS_AND_CATALOG.md).
