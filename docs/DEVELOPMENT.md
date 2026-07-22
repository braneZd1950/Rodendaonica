# Development vodič

## Preduvjeti

- Node.js 20+
- npm 10+

## Prvi setup

```bash
cd client
npm install
cp .env.example .env.local   # opcionalno
npm run dev
```

## Mock vs HTTP

| `VITE_API_MODE` | Ponašanje |
|-----------------|-----------|
| `mock` | Seed podaci, auth u localStorage, nema backend servera |
| `http` | Svi pozivi na `VITE_API_BASE_URL` |

Za lokalni backend (PostgreSQL + Express):

```bash
# iz korijena repozitorija
docker compose up -d
cd server && cp .env.example .env && npm install
npm run db:migrate && npm run db:seed
npm run dev
```

U `client/.env.local`:

```env
VITE_API_MODE=http
VITE_API_BASE_URL=/api
```

Vidi [BACKEND.md](./BACKEND.md) za puni vodič.

## Dodavanje nove funkcionalnosti

1. **Tip** → `client/src/types/`
2. **API ugovor** → `client/src/api/contracts/`
3. **Mock** → `client/src/mock/data/*.seed.ts` + handler u `createMockApi.ts`
4. **HTTP** → handler u `createHttpApi.ts`
5. **Stranica** → `client/src/pages/` koristi `api` ili `useAsyncData`

Nikad ne uvozite `mock/` iz stranica.

## Korisni alati u projektu

| Alat | Lokacija |
|------|----------|
| Rute | `constants/routes.ts` |
| Formatiranje (HR) | `lib/format.ts` |
| Greške | `lib/errors.ts` |
| Async učitavanje | `hooks/useAsyncData.ts` |
| Loader / error UI | `components/common/AsyncState.tsx` |

## Provjera prije PR-a

```bash
npm run typecheck
npm run lint
npm run build
```

## Čišćenje mock localStorage

U DevTools → Application → Local Storage, ključevi prefiksa `rodendaonica_`.
