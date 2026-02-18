import { db } from '#server/db'
import { dbTableNote, dbTablePolarProduct, dbTablePolarSubscription } from '#server/db/schemas/tables'
import { and, count, eq, inArray } from 'drizzle-orm'

// Plan name to note limit mapping
const PLAN_NOTE_LIMITS: Record<string, number> = {
  Starter: 50,
  Pro: 200,
  Max: Infinity,
}

export async function getUserNoteLimit(userId: number): Promise<number> {
  const [subscription] = await db
    .select({ productName: dbTablePolarProduct.name })
    .from(dbTablePolarSubscription)
    .innerJoin(dbTablePolarProduct, eq(dbTablePolarSubscription.productId, dbTablePolarProduct.id))
    .where(and(
      eq(dbTablePolarSubscription.userId, userId),
      inArray(dbTablePolarSubscription.status, ['active', 'trialing']),
    ))
    .limit(1)

  if (!subscription)
    return 0 // No active subscription

  // Match plan name (product name contains plan tier)
  const planName = Object.keys(PLAN_NOTE_LIMITS).find(key =>
    subscription.productName.toLowerCase().includes(key.toLowerCase()),
  )

  return planName ? (PLAN_NOTE_LIMITS[planName] ?? 0) : 0
}

export async function getUserNoteCount(userId: number): Promise<number> {
  const [result] = await db
    .select({ count: count() })
    .from(dbTableNote)
    .where(eq(dbTableNote.userId, userId))

  return result?.count ?? 0
}

export async function canUserCreateNote(userId: number): Promise<{ allowed: boolean, noSubscription: boolean, noteCount: number, noteLimit: number }> {
  const [noteLimit, noteCount] = await Promise.all([
    getUserNoteLimit(userId),
    getUserNoteCount(userId),
  ])

  // noteLimit === 0 means no active subscription (getUserNoteLimit returns 0 when no sub found)
  const noSubscription = noteLimit === 0

  return {
    allowed: noteCount < noteLimit,
    noSubscription,
    noteCount,
    noteLimit,
  }
}
