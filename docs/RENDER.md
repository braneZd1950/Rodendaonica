# Render — backend (Web Service)

## Settings
- **Root Directory:** `server`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Instance:** free ok (spava nakon idle — prvi request može trajati ~30–60 s)

## Environment
```
MONGO_URI=mongodb+srv://...
JWT_SECRET=duga-slucajna-tajna
CORS_ORIGIN=http://localhost:5173,https://rodendaonica.onrender.com
APP_URL=https://rodendaonica.onrender.com
AUTO_SEED=true
NODE_ENV=production
```

`AUTO_SEED=true` učitava demo korisnike **samo ako je baza prazna**:
- Roditelj: `ana.horvat@example.com` / `Test1234!`
- Igraonica: `partner@igraonicasunce.hr` / `Test1234!`

## MongoDB Atlas
Network Access → **Allow Access from Anywhere** (`0.0.0.0/0`), inače Render IP ne može do baze i API pada pri startu.

## Provjera
Nakon deploya otvori:
- https://rodendaonica-api.onrender.com/
- https://rodendaonica-api.onrender.com/api/health

Oba moraju vratiti JSON `{ "ok": true, ... }`. Ako vidiš 404, Root Directory / Start Command nisu ispravni.

---

# Render — frontend (Static Site)

## Settings
- **Root Directory:** `client`
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`

## Environment (build-time)
```
VITE_API_MODE=http
VITE_API_URL=https://rodendaonica-api.onrender.com
```

Nakon promjene env → **Clear build cache & deploy**.
