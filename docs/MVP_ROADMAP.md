# 📋 MVP Roadmap

## Pregled

Cilj MVP-a je napraviti prvu funkcionalnu verziju platforme koja pokriva sve ključne korisničke tokove — od pregleda igraonica do rezervacije i plaćanja.

---

## Faza 1 — Planning & Research
**Trajanje: 1 tjedan**

### Market Research
- [ ] Analiza konkurencije (domače i strane platforme)
- [ ] Analiza pricing modela
- [ ] Analiza UX flowa

### Definiranje MVP scopea
- [ ] Obavezne funkcionalnosti (must-have)
- [ ] Future features (nice-to-have)
- [ ] Monetizacijska strategija

### Branding
- [ ] Naziv platforme
- [ ] Logo
- [ ] UI Style Guide (boje, tipografija, komponente)

---

## Faza 2 — Setup projekta
**Trajanje: 2–3 dana**

### Frontend
- [ ] Vite + React + TypeScript
- [ ] React Router
- [ ] Axios
- [ ] Zustand ili Redux Toolkit
- [ ] React Query / TanStack Query
- [ ] SCSS arhitektura
- [ ] ESLint + Prettier konfiguracija

### Backend
- [ ] Node.js + Express + TypeScript
- [ ] Prisma ORM
- [ ] JWT auth setup
- [ ] Stripe SDK integracija

### DevOps
- [ ] GitHub repozitorij
- [ ] CI/CD pipeline
- [ ] Docker setup
- [ ] Render / Railway / VPS deployment konfiguracija

---

## Faza 3 — Authentication
**Trajanje: 3–5 dana**

### Parent Auth
- [ ] Registracija
- [ ] Login
- [ ] Forgot password
- [ ] Email verifikacija

### Business Auth
- [ ] Registracija igraonice
- [ ] Onboarding flow
- [ ] Upload slika

### Admin Auth
- [ ] Admin dashboard pristup
- [ ] Moderacija korisnika

---

## Faza 4 — Marketplace Listing
**Trajanje: 1 tjedan**

### Igraonice listing
Svaka igraonica prikazuje:
- [ ] Naslov
- [ ] Opis
- [ ] Slike
- [ ] Cijene i paketi
- [ ] Lokacija
- [ ] Kapacitet
- [ ] Primjerena dob djece

### Search & Filter
- [ ] Filtriranje po gradu
- [ ] Filtriranje po cijeni
- [ ] Filtriranje po dobi
- [ ] Filtriranje po broju djece
- [ ] Filtriranje po temi
- [ ] Opcija privatnog partyja

---

## Faza 5 — Booking System
**Trajanje: 2 tjedna**

> Ovo je core feature platforme.

### Kalendar termina
- [ ] Prikaz slobodnih termina
- [ ] Prikaz zauzetih termina
- [ ] Buffer između rezervacija

### Rezervacije
- [ ] Instant booking
- [ ] Request booking (igraonica potvrđuje)
- [ ] Potvrda rezervacije
- [ ] Otkazivanje rezervacije

### Notifikacije
- [ ] Email notifikacije (MVP)
- [ ] SMS notifikacije (later)
- [ ] Push notifikacije (later)

---

## Faza 6 — Payments
**Trajanje: 1 tjedan**

### Online akontacija — MVP
- [ ] Stripe integracija
- [ ] CorvusPay integracija
- [ ] Escrow koncept: platforma uzima akontaciju, igraonica dobiva potvrdu

### Online akontacija — Later
- [ ] Full escrow release system
- [ ] Klarna
- [ ] PayPal Pay Later
- [ ] Bankovne rate

---

## Faza 7 — Reviews & Ratings
**Trajanje: 2–3 dana**

- [ ] Ocjene (1–5 zvjezdica)
- [ ] Komentari
- [ ] Verified booking reviews (samo korisnici koji su rezervirali)
- [ ] Upload slika korisnika

---

## Faza 8 — Business Dashboard
**Trajanje: 1 tjedan**

- [ ] Analytics pregled
- [ ] Pregled rezervacija
- [ ] Pregled zarade
- [ ] Upravljanje terminima
- [ ] Blacklist korisnika
- [ ] Export podataka (CSV / PDF)

---

## Faza 9 — Admin Panel
**Trajanje: 3–5 dana**

- [ ] Moderacija platforme
- [ ] Approve/reject listinga
- [ ] Platforma analytics
- [ ] Refund management
- [ ] Support ticketing

---

## Faza 10 — Launch
**Trajanje: 1 tjedan**

- [ ] Deploy produkcije
- [ ] Analytics setup (GA4 / Plausible)
- [ ] Bug fixing
- [ ] Onboarding prvih igraonica
- [ ] SEO setup (meta tagovi, sitemap, robots.txt)
- [ ] Social media setup

---

## Preporučeni MVP Timeline

```
Mjesec 1
├── Setup projekta
├── Authentication
├── Listing igraonica
└── Booking engine

Mjesec 2
├── Payments
├── Reviews
├── Business dashboard
└── Deploy

Mjesec 3
├── Marketing
├── Onboarding partnera
├── Mobile optimization
└── Analytics
```

---

## Buduće funkcionalnosti (Post-MVP)

### Mobile App
- React Native + Expo

### AI Features
- AI preporuka igraonice
- AI chatbot support
- AI pricing optimization

### Loyalty System
- Bodovi za rezervacije
- Kuponi
- Referral program

### Social Features
- Shareable galerije
- Video reels
- Birthday invitations

### SaaS Ekspanzija
- Vjenčanja
- Event prostori
- Escape roomovi
- Igraonice za pse
