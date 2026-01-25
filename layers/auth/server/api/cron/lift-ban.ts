// server/api/cron/my-job.post.ts
export default defineEventHandler(async (event) => {
  // Security check
  const authHeader = getHeader(event, 'authorization')
  const cronSecret = useRuntimeConfig().cronSecret

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    throw createError({
      status: 401,
      message: 'Unauthorized',
    })
  }

  // Same logic as Nitro task
  const affectedUserIds = await liftBan()

  // eslint-disable-next-line no-console
  console.log('Lifted bans for users :>> ', affectedUserIds)

  return { result: affectedUserIds }
})
