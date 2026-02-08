/* eslint-disable no-console */
import { polarClient } from '../libs/polar'
import { upsertProduct } from '../services/polar/product'

export default defineTask({
  meta: {
    name: 'syncPolarProducts',
    description: 'Sync Polar products',
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
    return { result: data.result.items }
  },
})
