import type { H3Event, H3EventContext } from 'h3'
import type { UserWithId } from '~~/server/libs/auth'
import { auth } from '~~/server/libs/auth'

type AuthenticatedEvent = H3Event & {
  context: H3EventContext & {
    user: UserWithId
  }
}

export function defineAuthenticatedEventHandler<T>(
  handler: (event: AuthenticatedEvent) => T,
) {
  return defineEventHandler(async (event) => {
    // Fetch session
    const session = await auth.api.getSession({ headers: event.headers })

    // If user is not authenticated throw 401 error
    if (!session?.user) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    // Assign user to event context so it can be accessed in the handler
    event.context.user = session?.user as unknown as UserWithId

    return handler(event as AuthenticatedEvent)
  })
}
