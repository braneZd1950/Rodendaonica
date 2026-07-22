# MVP checklist — Rođendaonica

## Automatski testovi

```bash
# iz korijena repozitorija
npm run test
```

| Paket | Što pokriva |
|-------|-------------|
| `server` | API integracija: auth, venues, rezervacije, poruke, recenzije, KPI |
| `client` | Mock API tokovi + format helperi |

## Ručni smoke test (pre deploya)

### Preduvjeti
- [ ] `npm run db:seed` u `server/` (jednom)
- [ ] `npm run dev` (client + server)
- [ ] `client/.env.local`: `VITE_API_MODE=http`, `VITE_API_BASE_URL=/api`

### Javno (bez prijave)
- [ ] Početna, lista igraonica, detalj igraonice
- [ ] `/rezerviraj` wizard — zauzeti termini, neprijavljen → redirect na login

### Roditelj (`ana.horvat@example.com` / `Test1234!`)
- [ ] Prijava → `/profil`
- [ ] `/rezervacije` — lista + nova rezervacija
- [ ] `/poruke` — threadovi, slanje poruke
- [ ] Odjava

### Igraonica (`partner@igraonicasunce.hr` / `Test1234!`)
- [ ] Prijava → `/dashboard` (KPI)
- [ ] `/kalendar` — rezervacije po datumu
- [ ] `/poslovne-rezervacije` — filteri
- [ ] `/poslovne-poruke` — odgovor roditelju
- [ ] `/recenzije` — odgovor na recenziju
- [ ] `/postavke-igraonice`

### Registracija
- [ ] Novi roditelj → profil dostupan odmah
- [ ] Nova igraonica → dashboard (prazan dok nema venue veza)

## MVP status (automatska provjera)

| Područje | Status |
|----------|--------|
| Auth login/register | ✅ testirano |
| Venues + busy slots | ✅ testirano |
| Rezervacije CRUD (create/list) | ✅ testirano |
| Poruke (list/send) | ✅ testirano |
| Recenzije (list/reply) | ✅ testirano |
| Business KPI | ✅ testirano |
| Katalog paketa i dodataka (Faza A) | ✅ testirano |
| Plaćanje (Stripe) | ⏳ placeholder |
| Email reset lozinke | ⏳ mock/API stub |
| E2E demo video (~5 min) | ✅ `npm run e2e:demo` — vidi [E2E_DEMO.md](./E2E_DEMO.md) |

## Poznata ograničenja (nije MVP blocker)

- Plaćanje akontacije nije produkcijski
- Nove igraonice nemaju automatski venue u katalogu (Faza D)
- Book wizard još koristi hardkodirane pakete (Faza C)
- Business UI za uređivanje kataloga — Faza B (sljedeće)
- Vidi [MVP_STATUS_AND_CATALOG.md](./MVP_STATUS_AND_CATALOG.md)
