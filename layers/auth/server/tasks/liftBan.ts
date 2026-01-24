import { db } from '#server/db'
import { user as tableUser } from '#server/db/schemas/tables'
import { and, eq, inArray, isNotNull, lt } from 'drizzle-orm'

export default defineTask({
  meta: {
    name: 'liftBan',
    description: 'Lift user bans',
  },
  async run() {
    // eslint-disable-next-line no-console
    console.log('Running liftBan task...')

    const result = await db.query.user.findMany({
      where: (
        and(
          eq(tableUser.banned, true),
          isNotNull(tableUser.banExpires),
          lt(tableUser.banExpires, new Date().toISOString()),
        )
      ),
    })

    // Lift bans for users whose ban has expired
    // Perf: Instead of loop, use in bulk update via `inArray`
    const userIds = result.map(user => user.id)

    if (userIds.length > 0) {
      // eslint-disable-next-line no-console
      console.log('Lifting bans for users :>> ', userIds)

      await db.update(tableUser).set({
        banned: false,
        banReason: null,
        banExpires: null,
      }).where(inArray(tableUser.id, userIds))
    }
    else {
      // eslint-disable-next-line no-console
      console.log('No due bans to lift')
    }

    return { result: userIds }
  },
})
