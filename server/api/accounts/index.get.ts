import { eq } from 'drizzle-orm'
import { db } from '~~/server/db'
import { account } from '~~/server/db/schemas/tables/account'

export default defineAuthenticatedEventHandler(async (event) => {
  const userId = event.context.user.id
  const runtimeConfig = useRuntimeConfig(event)

  // Get configured social providers from runtimeConfig
  const socialProviderIds = runtimeConfig.public.shared.auth.socialProviders.map(p => p.id)

  // Fetch all accounts for current user
  const allAccounts = await db
    .select({
      providerId: account.providerId,
      accountId: account.accountId,
      createdAt: account.createdAt,
    })
    .from(account)
    .where(eq(account.userId, userId))

  // Check if user has email/password account
  const hasEmailAccount = allAccounts.some(acc => acc.providerId === 'credential')

  // Filter social accounts
  const socialAccounts = allAccounts.filter(acc =>
    socialProviderIds.includes(acc.providerId),
  )

  // Transform to include all providers (connected or not)
  const linkedAccounts = socialProviderIds.map((providerId) => {
    const linkedAccount = socialAccounts.find(acc => acc.providerId === providerId)
    return {
      provider: providerId,
      isConnected: !!linkedAccount,
      accountId: linkedAccount?.accountId || null,
      createdAt: linkedAccount?.createdAt || null,
    }
  })

  return {
    accounts: linkedAccounts,
    hasEmailAccount,
  }
})
