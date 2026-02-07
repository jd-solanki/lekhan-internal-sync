import { defineCommand, runMain } from 'citty'
import { polarClient } from '../layers/payments/server/libs/polar'
import { upsertProduct } from '../layers/payments/server/services/polar/product'

// npx tsx --tsconfig .nuxt/tsconfig.json scripts/syncPolarProducts.ts
const main = defineCommand({
  meta: {
    name: 'syncPolarProducts',
    description: 'Sync Polar products via Polar SDK',
  },
  async run() {
    // We assume you won't have more than 100 products so don't implement pagination here
    const data = await polarClient.products.list({ limit: 100 })

    console.log(`Fetched products from Polar (${data.result.items.length}):\n`, data.result.items.map(p => p.name).join('\n'))

    // Prepare drizzle query to upsert products into local DB
    for (const product of data.result.items) {
      await upsertProduct(product)
      console.log(`Upserted product '${product.name}' (${product.id})`)
    }

    console.log('All products synced successfully')
    process.exit(0)
  },
})

runMain(main)
