import { createApp } from './app.js'
import { connectDatabase } from './config/db.js'
import { env } from './config/env.js'

async function maybeAutoSeed() {
  if (!env.autoSeed) return

  const { User } = await import('./models/User.js')
  const count = await User.countDocuments()
  if (count > 0) return

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
