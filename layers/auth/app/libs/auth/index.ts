import type { Simplify } from 'type-fest'
import type { auth } from '~~/layers/auth/server/libs/auth'
import { polarClient } from '@polar-sh/better-auth/client' // https://github.com/better-auth/better-auth/issues/5539#issuecomment-3646695288
import { adminClient, inferAdditionalFields, lastLoginMethodClient, magicLinkClient } from 'better-auth/client/plugins'

import { createAuthClient } from 'better-auth/vue'

export const authClient = createAuthClient({
  plugins: [
    adminClient(),
    magicLinkClient(),
    polarClient(),
    lastLoginMethodClient(),

    // This plugin infers the additional fields we've added to the user model in server/libs/auth/index.ts
    // Docs: https://www.better-auth.com/docs/concepts/typescript#inferring-additional-fields-on-client
    inferAdditionalFields<typeof auth>(),
  ],
})

// INFO: In future, we are going to use uuid v7 which is sortable & string
export type Session = typeof authClient.$Infer.Session
export type User = Simplify<Omit<Session['user'], 'id'> & { id: number }>
export type UserSession = Session['session']
