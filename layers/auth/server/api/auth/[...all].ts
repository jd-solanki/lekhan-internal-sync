import { auth } from '~~/layers/auth/server/libs/auth'

export default defineEventHandler((event) => {
  return auth.handler(toWebRequest(event))
})
