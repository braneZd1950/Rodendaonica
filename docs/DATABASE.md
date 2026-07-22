# 🗄️ Database Schema

## Pregled modela

```
User ──────────────── Booking ──────────── Business
  │                      │                    │
  └── Review             └── Payment          └── TimeSlot
```

---

## Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─────────────────────────────────────────
// USER
// ─────────────────────────────────────────

enum Role {
  PARENT
  BUSINESS
  ADMIN
}

model User {
  id              String    @id @default(cuid())
  email           String    @unique
  passwordHash    String
  role            Role      @default(PARENT)
  firstName       String
  lastName        String
  phone           String?
  emailVerified   Boolean   @default(false)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  // Relations
  bookings        Booking[]
  reviews         Review[]
  business        Business?
  refreshTokens   RefreshToken[]
}

model RefreshToken {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String
  expiresAt DateTime
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// ─────────────────────────────────────────
// BUSINESS (Igraonica)
// ─────────────────────────────────────────

enum BusinessStatus {
  PENDING
  APPROVED
  REJECTED
  SUSPENDED
}

model Business {
  id          String         @id @default(cuid())
  ownerId     String         @unique
  name        String
  description String
  status      BusinessStatus @default(PENDING)
  city        String
  address     String
  lat         Float?
  lng         Float?
  capacity    Int
  minAge      Int?
  maxAge      Int?
  images      String[]       // Cloudinary URLs
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt

  // Relations
  owner       User           @relation(fields: [ownerId], references: [id])
  packages    Package[]
  timeSlots   TimeSlot[]
  bookings    Booking[]
  reviews     Review[]
}

model Package {
  id          String   @id @default(cuid())
  businessId  String
  name        String
  description String?
  price       Float
  duration    Int      // u minutama
  isActive    Boolean  @default(true)

  business    Business  @relation(fields: [businessId], references: [id])
  bookings    Booking[]
}

// ─────────────────────────────────────────
// BOOKING
// ─────────────────────────────────────────

enum BookingStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
}

enum BookingType {
  INSTANT
  REQUEST
}

model Booking {
  id            String        @id @default(cuid())
  userId        String
  businessId    String
  packageId     String
  timeSlotId    String
  status        BookingStatus @default(PENDING)
  type          BookingType   @default(INSTANT)
  childrenCount Int
  childAge      Int?
  notes         String?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  // Relations
  user          User          @relation(fields: [userId], references: [id])
  business      Business      @relation(fields: [businessId], references: [id])
  package       Package       @relation(fields: [packageId], references: [id])
  timeSlot      TimeSlot      @relation(fields: [timeSlotId], references: [id])
  payment       Payment?
  review        Review?
}

model TimeSlot {
  id          String    @id @default(cuid())
  businessId  String
  startsAt    DateTime
  endsAt      DateTime
  isAvailable Boolean   @default(true)

  business    Business  @relation(fields: [businessId], references: [id])
  bookings    Booking[]
}

// ─────────────────────────────────────────
// PAYMENT
// ─────────────────────────────────────────

enum PaymentStatus {
  PENDING
  CAPTURED
  REFUNDED
  FAILED
}

enum PaymentProvider {
  STRIPE
  CORVUSPAY
}

model Payment {
  id              String          @id @default(cuid())
  bookingId       String          @unique
  amount          Float           // akontacija u eurima
  currency        String          @default("EUR")
  status          PaymentStatus   @default(PENDING)
  provider        PaymentProvider
  providerRef     String?         // Stripe PaymentIntent ID / CorvusPay ref
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  booking         Booking         @relation(fields: [bookingId], references: [id])
}

// ─────────────────────────────────────────
// REVIEW
// ─────────────────────────────────────────

model Review {
  id          String   @id @default(cuid())
  userId      String
  businessId  String
  bookingId   String   @unique
  rating      Int      // 1-5
  comment     String?
  images      String[] // Cloudinary URLs
  createdAt   DateTime @default(now())

  user        User     @relation(fields: [userId], references: [id])
  business    Business @relation(fields: [businessId], references: [id])
  booking     Booking  @relation(fields: [bookingId], references: [id])
}
```

---

## Indeksi (preporučeni)

```sql
-- Pretraga po gradu
CREATE INDEX idx_business_city ON "Business"(city);

-- Filtriranje termina po datumu
CREATE INDEX idx_timeslot_starts ON "TimeSlot"("startsAt");

-- Rezervacije korisnika
CREATE INDEX idx_booking_user ON "Booking"("userId");

-- Rezervacije igraonice
CREATE INDEX idx_booking_business ON "Booking"("businessId");
```

---

## Migracije

```bash
# Kreiranje migracije
npx prisma migrate dev --name init

# Deploy na produkciju
npx prisma migrate deploy

# Pregled baze
npx prisma studio
```
