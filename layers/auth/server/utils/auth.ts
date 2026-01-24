import type { createAuthMiddleware } from 'better-auth/plugins'
import type { H3Event, H3EventContext } from 'h3'
import type { User } from '~~/layers/auth/server/libs/auth'
import { auth } from '~~/layers/auth/server/libs/auth'

type AuthenticatedEvent = H3Event & {
  context: H3EventContext & {
    user: User
  }
}

type AdminEvent = AuthenticatedEvent

export function defineAuthenticatedEventHandler<T>(
  handler: (event: AuthenticatedEvent) => T,
) {
  return defineEventHandler(async (event) => {
    // Fetch session
    const session = await auth.api.getSession({ headers: event.headers })

    // If user is not authenticated throw 401 error
    if (!session?.user) {
      throw createError({ status: 401, statusText: 'Unauthorized' })
    }

    // Assign user to event context so it can be accessed in the handler
    event.context.user = session?.user

    return handler(event as AuthenticatedEvent)
  })
}

export function defineAdminEventHandler<T>(
  handler: (event: AuthenticatedEvent) => T,
) {
  return defineAuthenticatedEventHandler(async (event) => {
    const user = event.context.user

    // If user is not admin throw 403 error
    if (user.role !== 'admin') {
      throw createError({ status: 403, statusText: 'Forbidden' })
    }

    return handler(event as AdminEvent)
  })
}

type MiddlewareHandlerCtx = Parameters<Parameters<typeof createAuthMiddleware>[0]>[0]
export function handleOAuthAccountLinkEmailMismatch(ctx: MiddlewareHandlerCtx, redirectUrl: string) {
  // NOTE: When OAuth provider email doesn't match existing user email betterAuth still marks it as successful
  //       due to that we can't catch error on client and had to use this workaround to show proper error message to user
  if (ctx.path === '/error') {
    // Get error from query params
    const error = ctx.query?.error
    if (!error || error !== 'email_doesn\'t_match')
      return

    // Set error cookie
    ctx.setCookie(
      'flash_message__error',
      'The email from the social provider doesn\'t match your account email. Please use the correct social account or sign in with email and password to link your social account.',
      {
        path: '/',
        httpOnly: false,
      },
    )

    // Redirect to your page without error param
    throw ctx.redirect(redirectUrl)
  }
}
