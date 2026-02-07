export default defineTask({
  meta: {
    name: 'liftBan',
    description: 'Lift user bans',
  },
  async run() {
    // eslint-disable-next-line no-console
    console.log('Running liftBan task...')

    const affectedUserIds = await liftBan()

    // eslint-disable-next-line no-console
    console.log('Lifted bans for users :>> ', affectedUserIds)

    return { result: affectedUserIds }
  },
})
