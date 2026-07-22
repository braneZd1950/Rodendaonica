# 🚀 Deployment

## Pregled infrastrukture

| Komponenta | Servis | Napomena |
|---|---|---|
| Frontend | Vercel | Automatski deploy iz GitHub |
| Backend | Render / Railway | Node.js server |
| Database | Neon / Supabase | Managed PostgreSQL |
| File Storage | Cloudinary / AWS S3 | Slike igraonica |
| Payments | Stripe + CorvusPay | Webhook support |

---

## Environment varijable

### Client (`client/.env`)

```env
VITE_API_URL=https://api.yourdomain.com
VITE_STRIPE_PUBLIC_KEY=pk_live_...
```

### Server (`server/.env`)

```env
# Server
PORT=3001
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:pass@host/dbname

# Auth
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# CorvusPay
CORVUSPAY_MERCHANT_ID=...
CORVUSPAY_SECRET_KEY=...

# Storage
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Email
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=...
FROM_EMAIL=noreply@yourdomain.com
```

---

## Docker setup

### `docker-compose.yml`

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: igraonice_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  server:
    build: ./server
    ports:
      - "3001:3001"
    depends_on:
      - postgres
    environment:
      DATABASE_URL: postgresql://postgres:password@postgres:5432/igraonice_db

  client:
    build: ./client
    ports:
      - "5173:5173"

volumes:
  postgres_data:
```

---

## CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Render
        run: curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        run: npx vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## Deployment checklist

### Pre-launch
- [ ] Env varijable postavljene u produkciji
- [ ] Database migracije pokrenute (`prisma migrate deploy`)
- [ ] Stripe webhooks konfigurirani
- [ ] CORS postavke provjerene
- [ ] SSL certifikati aktivni
- [ ] Rate limiting aktivan
- [ ] Error tracking setup (Sentry)

### Post-launch
- [ ] Analytics setup (GA4 / Plausible)
- [ ] Uptime monitoring (BetterUptime / UptimeRobot)
- [ ] Backup baze podataka konfiguriran
- [ ] Logs pregled
