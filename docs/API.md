# REST API ugovor — Rođendaonica

Referentna implementacija frontenda: `client/src/api/implementations/http/createHttpApi.ts`

**Base URL:** `{VITE_API_BASE_URL}` npr. `https://api.example.com/api`

**Auth header:** `Authorization: Bearer <token>` (frontend trenutno šalje `accountId` dok backend ne izda JWT)

**Content-Type:** `application/json`

---

## Auth

### `POST /auth/login`

```json
{ "email": "string", "password": "string", "rememberMe": boolean }
```

**Response 200:**

```json
{
  "account": { "id": "string", "role": "parent|business", "email": "string", "displayName": "string" },
  "session": { "accountId": "string", "role": "string", "email": "string", "rememberMe": boolean, "loginAt": "ISO8601" }
}
```

### `POST /auth/register`

```json
{
  "role": "parent|business",
  "email": "string",
  "password": "string",
  "firstName": "string?",
  "lastName": "string?",
  "businessName": "string?"
}
```

Response: isto kao login.

---

## Venues (javno)

### `GET /venues`

Lista igraonica.

### `GET /venues/:slug`

Detalj jedne igraonice s aktivnim katalogom. `404` ako ne postoji.

**Response (dodatna polja):**

```json
{
  "id": "1",
  "slug": "igraonica-sunce",
  "name": "Igraonica Sunce",
  "description": "string",
  "images": ["https://..."],
  "packages": [
    {
      "id": "pkg-standard",
      "name": "Standard (2h)",
      "description": "string",
      "durationHours": 2,
      "basePriceEur": 180,
      "maxGuests": 20,
      "includedItems": ["..."],
      "active": true,
      "sortOrder": 1
    }
  ],
  "addons": [
    {
      "id": "addon-cake",
      "name": "Torta po izboru",
      "description": "string",
      "category": "food",
      "priceEur": 35,
      "active": true,
      "sortOrder": 1
    }
  ]
}
```

Kategorije dodataka: `food` | `entertainment` | `decor` | `other`.

---

## Parents (auth: parent)

### `GET /parents/me`

Trenutno prijavljeni roditelj.

### `GET /parents/:id`

Profil roditelja (za igraonicu — ograničena polja).

### `GET /parents/:parentId/reservations`

Lista rezervacija roditelja.

---

## Businesses (auth: business)

### `GET /businesses/me`

Trenutna igraonica.

### `GET /businesses/me/venues`

Lista lokacija (venue) koje pripadaju prijavljenoj igraonici.

### `GET /businesses/me/venues/:slug/catalog`

Puni katalog za uređivanje (uključuje neaktivne pakete i dodatke). `403` ako venue ne pripada igraonici.

### `PUT /businesses/me/venues/:slug/catalog`

Ažurira opis, slike, pakete i dodatke. Automatski ažurira `priceFrom` na minimum aktivnih paketa.

```json
{
  "description": "string",
  "images": ["https://..."],
  "packages": [/* min. 1 */],
  "addons": []
}
```

### `GET /businesses/:businessId/overview`

```json
{
  "business": { /* BusinessUser */ },
  "kpi": {
    "month": "2026-05",
    "reservations": 26,
    "revenueEur": 4860,
    "occupancyPct": 82,
    "avgRating": 4.9
  }
}
```

### `GET /businesses/:businessId/reservations`

Rezervacije igraonice.

---

## Reservations

### `GET /reservations/:id`

Detalj rezervacije.

### `GET /venues/:slug/busy-slots?date=YYYY-MM-DD`

Zauzeti termini (npr. `["14:00","16:00"]`) za odabrani datum.

### `POST /reservations`

Kreiranje rezervacije (auth: parent).

```json
{
  "venueSlug": "igraonica-sunce",
  "date": "2026-06-20",
  "time": "14:00",
  "guestCount": 15,
  "packageName": "Standard (2h)",
  "childName": "Luka",
  "notes": "opcionalno"
}
```

**Response 201:** `Reservation` objekt (`status`: `pending_payment`).

**Greške:** `400` termin zauzet, `401` nije roditelj.

---

## Messages

### `GET /parents/:parentId/conversations`
### `GET /businesses/:businessId/conversations`

### `POST /conversations/:conversationId/messages`

```json
{ "sender": "parent|business", "text": "string", "status": "primljena|isporucena|pogledana?" }
```

---

## Reviews

### `GET /businesses/:businessId/reviews`

### `POST /reviews/:reviewId/reply`

```json
{ "text": "string" }
```

---

## Greške

```json
{ "message": "Opis greške" }
```

| Status | Značenje |
|--------|----------|
| 401 | Neautorizirano — frontend briše sesiju i preusmjerava na `/prijava` |
| 403 | Zabranjeno |
| 404 | Nije pronađeno |
| 422 | Validacija |
| 500 | Server greška |

---

## Tipovi (TypeScript)

Vidi `client/src/types/` za potpune definicije domenskih objekata.
