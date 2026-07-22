import { createApp } from './app.js'
import { connectDatabase } from './config/db.js'
import { env } from './config/env.js'

async function maybeAutoSeed() {
  if (!env.autoSeed) {
    const { User } = await import('./models/User.js')
    const count = await User.countDocuments()
    if (count === 0) {
      console.warn(
        '[seed] Baza je prazna. Demo login (ana.horvat@example.com) neće raditi dok ne postavite AUTO_SEED=true ili ne pokrenete npm run db:seed.',
      )
    }
    return
  }

  const { User } = await import('./models/User.js')
  const count = await User.countDocuments()
  if (count > 0) {
    console.log(`[seed] Baza već ima ${count} korisnika — seed se preskače.`)
    return
  }

  const { seedDatabase, DEMO_PASSWORD } = await import('./lib/seedDatabase.js')
  await seedDatabase()
  console.log(`Demo podaci učitani (AUTO_SEED). Lozinka: ${DEMO_PASSWORD}`)
}

async function main() {
  await connectDatabase()
  await maybeAutoSeed()

  const app = createApp()

  app.listen(env.port, () => {
    console.log(`Rođendaonica API → http://localhost:${env.port}/api`)
  })
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
