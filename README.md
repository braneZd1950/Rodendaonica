# Rođendaonica

Platforma za rezervaciju dječjih rođendana u igraonicama — React frontend s mock ili REST API backendom.

## Struktura repozitorija

```
Rođendaonica/
  client/          # Vite + React + TypeScript frontend
  server/          # Express API skeleton (in-memory seed)
  docs/            # Arhitektura, API ugovor, development vodič
```

## Brzi start (development)

```bash
cd client
npm install
npm run dev
```

Otvori [http://localhost:5173](http://localhost:5173).

**Demo prijava (mock mod):**

| Uloga | Email | Lozinka |
|-------|-------|---------|
| Roditelj | ana.horvat@example.com | Test1234! |
| Igraonica | partner@igraonicasunce.hr | Test1234! |

## Okruženja

| Okruženje | Datoteka | API mod |
|-----------|----------|---------|
| Development | `client/.env.development` | `mock` |
| Lokalni override | `client/.env.local` | po želji |
| Produkcija | CI / hosting env vars | `http` |

Kopirajte `client/.env.example` i prilagodite vrijednosti.

## Skripte

```bash
npm run dev       # development server
npm run build     # produkcijski build
npm run preview   # pregled produkcijskog builda
npm run lint      # ESLint
npm run typecheck # TypeScript provjera
```

## Dokumentacija

- [Arhitektura frontenda](docs/ARCHITECTURE.md)
- [REST API ugovor (backend)](docs/API.md)
- [Development vodič](docs/DEVELOPMENT.md)

## Backend (MongoDB + Express)

```bash
cd server && cp .env.example .env   # postavi MONGO_URI
npm install && npm run db:seed && npm run dev
```

Povezivanje frontenda: `VITE_API_MODE=http` i `VITE_API_BASE_URL=/api` u `client/.env.local`.

Vodič: [docs/BACKEND.md](docs/BACKEND.md) · API ugovor: [docs/API.md](docs/API.md)

## Licenca

Privatni projekt.
