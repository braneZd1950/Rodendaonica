import { connectDatabase, disconnectDatabase } from '../config/db.js'
import { seedTestUsers, TEST_BUSINESS, TEST_PARENT, TEST_USER_PASSWORD } from '../lib/seedTestUsers.js'

async function main() {
  await connectDatabase()
  await seedTestUsers()

  console.log('\n✓ Test korisnici spremni u MongoDB\n')
  console.log('Lozinka (oba računa):', TEST_USER_PASSWORD)
  console.log('')
  console.log('Roditelj:')
  console.log('  Email:', TEST_PARENT.email)
  console.log('  Prijava → /prijava → ulogirajte se kao roditelj')
  console.log('')
  console.log('Igraonica:')
  console.log('  Email:', TEST_BUSINESS.email)
  console.log('  OIB:', TEST_BUSINESS.oib)
  console.log('  Lokacija:', TEST_BUSINESS.venueSlug)
  console.log('  Prijava → /prijava → ulogirajte se kao igraonica')
  console.log('')

  await disconnectDatabase()
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
