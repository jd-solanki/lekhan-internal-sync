import readline from 'node:readline/promises'
import { Polar } from '@polar-sh/sdk'
import dotenv from 'dotenv'
import env from '../server/libs/env'

dotenv.config()

const polarServer = env.POLAR_SERVER

console.log(`Polar server: ${polarServer}`)

if (polarServer?.toLowerCase() === 'production') {
  console.error('Refuse to delete customers in production')
  process.exit(1)
}

const polar = new Polar({
  accessToken: env.POLAR_ACCESS_TOKEN,
  server: polarServer,
})

async function deleteAllCustomers() {
  console.log('🚀 Starting customer deletion process...')

  if (!process.env.POLAR_ACCESS_TOKEN) {
    console.error('❌ POLAR_ACCESS_TOKEN not found in environment variables')
    process.exit(1)
  }

  console.log('✅ Access token loaded')

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  const response = await rl.question('Run in dry run mode? (yes/no): ')
  rl.close()
  const dryRun = response.trim().toLowerCase().startsWith('y')

  console.log(`Dry run: ${dryRun}`)

  let totalCustomers = 0
  let deletedCustomers = 0
  let failedDeletions = 0

  try {
    console.log('\n📥 Fetching customers...')

    let pageNumber = 1
    let maxPage = 1

    while (pageNumber <= maxPage) {
      console.log(`\n📄 Fetching page ${pageNumber} of ${maxPage}`)

      const page = await polar.customers.list({
        // organizationId: '1dbfc517-0bbf-4301-9ba8-555ca42b9737',
        page: pageNumber,
        limit: 100,
      })

      const items = page.result.items
      const pagination = page.result.pagination

      maxPage = pagination.maxPage
      console.log(`📄 Processing page ${pageNumber} with ${items.length} customers`)
      console.log(`📊 Pagination total: ${pagination.totalCount}, max page: ${pagination.maxPage}`)

      if (items.length === 0) {
        console.log('ℹ️  No customers found in this page')
        pageNumber += 1
        continue
      }

      totalCustomers += items.length

      for (const customer of items) {
        console.log(`\n🔍 Customer ID: ${customer.id}`)
        console.log(`   Email: ${customer.email || 'N/A'}`)
        console.log(`   Name: ${customer.name || 'N/A'}`)

        if (dryRun) {
          console.log(`   🧪 Dry run: would delete customer ${customer.id}`)
          continue
        }

        try {
          console.log(`   🗑️  Deleting customer ${customer.id}...`)
          await polar.customers.delete({
            id: customer.id,
          })
          deletedCustomers++
          console.log(`   ✅ Successfully deleted customer ${customer.id}`)
        }
        catch (error) {
          failedDeletions++
          console.error(`   ❌ Failed to delete customer ${customer.id}`)
          console.error(`   Error: ${error instanceof Error ? error.message : String(error)}`)
        }
      }

      pageNumber += 1
    }

    console.log(`\n${'='.repeat(50)}`)
    console.log('📊 Deletion Summary:')
    console.log(`   Total customers found: ${totalCustomers}`)
    console.log(`   Successfully deleted: ${deletedCustomers}`)
    console.log(`   Failed deletions: ${failedDeletions}`)
    console.log('='.repeat(50))

    if (dryRun) {
      console.log(`\n🧪 Dry run complete. Customers scanned: ${totalCustomers}`)
      return
    }

    if (failedDeletions > 0) {
      console.log('\n⚠️  Some deletions failed. Please check the logs above.')
      process.exit(1)
    }
    else if (deletedCustomers === 0) {
      console.log('\nℹ️  No customers to delete.')
    }
    else {
      console.log('\n✅ All customers deleted successfully!')
    }
  }
  catch (error) {
    console.error('\n❌ Fatal error during customer deletion:')
    console.error(error instanceof Error ? error.message : String(error))
    console.error('\nStack trace:')
    console.error(error)
    process.exit(1)
  }
}

deleteAllCustomers()
