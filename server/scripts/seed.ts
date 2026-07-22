import { connectDatabase, disconnectDatabase } from '../config/db.js'
import { DEMO_PASSWORD, seedDatabase } from '../lib/seedDatabase.js'

async function main() {
  await connectDatabase()
  await seedDatabase()
  console.log('Seed completed. Demo password:', DEMO_PASSWORD)
  await disconnectDatabase()
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
