import { and, eq, isNotNull, lt } from 'drizzle-orm'
import { dbTableUser } from '~~/server/db/schemas/tables'

export async function liftBan() {
  const result = await db.update(dbTableUser)
    .set({
      banned: false,
      banReason: null,
      banExpires: null,
    })
    .where(
      and(
        eq(dbTableUser.banned, true),
        isNotNull(dbTableUser.banExpires),
        lt(dbTableUser.banExpires, new Date().toISOString()),
      ),
    )
    .returning({ id: dbTableUser.id }) // optional: for logging

  return result.map(u => u.id)
}
