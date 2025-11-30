import { auth } from '~~/layers/launchdayone-auth/server/libs/auth'

export default defineEventHandler((event) => {
  return auth.handler(toWebRequest(event))
})
