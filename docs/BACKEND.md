# Backend — Rođendaonica (MongoDB)

Express API usklađen s frontend `createHttpApi.ts`. Struktura u `server/`:

```
server/
  server.ts              # ulazna točka
  app.ts                 # Express + rute
  config/                # env, db, stripe
  models/                # Mongoose sheme
  services/              # poslovna logika
  controllers/           # HTTP handleri
  routes/                # API rute
  middlewares/           # auth, errors
  utils/                 # jwt, mappers
  scripts/seed.ts        # demo podaci
```

## Postavljanje

1. Kopiraj `server/.env.example` → `server/.env`.
2. Odaberi jedan način spajanja na bazu (vidi dolje).
3. Pokreni `npm run db:seed` (jednom, osim ako koristiš `AUTO_SEED=true`).

### MongoDB — tri opcije

| Opcija | `.env` | Kada koristiti |
|--------|--------|----------------|
| **Atlas** | `MONGO_URI=mongodb+srv://...` | Tim, staging, produkcija |
| **In-memory** | `MONGO_URI=memory` + `AUTO_SEED=true` | Brzi lokalni dev bez Atasa |
| **Lokalni Mongo** | `MONGO_URI=mongodb://127.0.0.1:27017/rodendaonica` | Docker (`npm run db:up`) ili MongoDB Community |

### Atlas: greška „IP isn't whitelisted”

1. [MongoDB Atlas](https://cloud.mongodb.com) → **Network Access**
2. **Add IP Address** → **Add Current IP Address** (ili `0.0.0.0/0` samo za development)
3. Pričekaj 1–2 minute, restartaj `npm run dev`

### Brzi fix (bez Atasa)

U `server/.env`:

```env
MONGO_URI=memory
AUTO_SEED=true
```

Server automatski pokreće in-memory bazu i puni demo podatke pri prvom startu.

```bash
cd server
npm install
npm run db:seed
npm run dev
```

## Frontend

`client/.env.local`:

```env
VITE_API_MODE=http
VITE_API_BASE_URL=/api
```

## Demo računi

| Uloga | Email | Lozinka |
|-------|-------|---------|
| Roditelj | ana.horvat@example.com | Test1234! |
| Igraonica | partner@igraonicasunce.hr | Test1234! |

## API prefiks

Sve pod `/api` — vidi [API.md](./API.md).
