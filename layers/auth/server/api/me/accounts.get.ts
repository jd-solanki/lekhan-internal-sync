import { eq } from 'drizzle-orm'

export default defineAuthenticatedEventHandler(async (event) => {
  const userId = event.context.user.id
  const runtimeConfig = useRuntimeConfig(event)

  // Get configured social providers from runtimeConfig
  const socialProviderIds = runtimeConfig.public.shared.auth.socialProviders.map(p => p.id)

  // Fetch all accounts for current user
  const allAccounts = await db
    .select({
      providerId: dbTableAccount.providerId,
      accountId: dbTableAccount.accountId,
      createdAt: dbTableAccount.createdAt,
    })
    .from(dbTableAccount)
    .where(eq(dbTableAccount.userId, userId))

  // Check if user has email/password account
  const hasEmailAccount = allAccounts.some(acc => acc.providerId === 'credential')

  // Filter social accounts
  const socialAccounts = allAccounts.filter(acc =>
    socialProviderIds.includes(acc.providerId as typeof socialProviderIds[number]),
  )

  // Transform to include all providers (connected or not)
  const accounts = socialProviderIds.map((providerId) => {
    const linkedAccount = socialAccounts.find(acc => acc.providerId === providerId)
    return {
      provider: providerId,
      isConnected: !!linkedAccount,
      accountId: linkedAccount?.accountId || null,
      createdAt: linkedAccount?.createdAt || null,
    }
  })

  return {
    accounts,
    hasEmailAccount,
  }
})
