import type { SchemaForgotPassword, SchemaMagicLink, SchemaResetPassword, SchemaSignUp } from '~~/shared/schemas/auth'
import { authClient } from '~/libs/auth'

export const useUserStore = defineStore('user', () => {
  // const { user, clear, fetch: fetchUserSession, ...restOfUseUserSession } = useUserSession()
  const session = ref<Awaited<ReturnType<typeof authClient.useSession>> | null>(null)
  const lastSignInMethod = useCookie('lastSignInMethod')

  /*
    This function initializes the user session by fetching it from the authClient
    With this, our nuxt app won't re-fetch the user session on client side
    // NOTE: We've to call init() on app start
  */
  async function init() {
    const data = await authClient.useSession(useFetch)
    session.value = data
  }

  const user = computed(() => session.value?.data?.user)
  const isLoading = computed(() => session.value?.isPending)

  const { errorToast, successToast } = useToastMessage()
  const runtimeConfig = useRuntimeConfig()

  async function sendVerificationEmail(email: string) {
    await authClient.sendVerificationEmail({ email })
  }

  async function signOut() {
    await authClient.signOut()
    await navigateTo(runtimeConfig.public.app.routes.signIn)
  }

  async function signUp(body: SchemaSignUp) {
    await authClient.signUp.email(body, {
      onRequest: (_ctx) => {
        // show loading
      },
      onSuccess: async (_ctx) => {
        lastSignInMethod.value = 'email'

        if (runtimeConfig.public.shared.isEmailVerificationRequiredForAccess) {
        // Send verification mail and redirect to verify email page
        // await sendVerificationEmail()
          await navigateTo(`${runtimeConfig.public.app.routes.verifyEmail}?state=mail-sent`)
        }
        else {
        // If email verification is optional, redirect to home page
          await navigateTo(runtimeConfig.public.app.routes.home)
        }
      },
      onError: (ctx) => {
        errorToast({
          title: 'Sign Up Failed',
          description: ctx.error.message,
        })
      },
    })
  }

  async function signIn(body: SchemaSignIn) {
    await authClient.signIn.email(body, {
      onRequest: (_ctx) => {
        // show loading
      },
      onSuccess: async (_ctx) => {
        lastSignInMethod.value = 'email'

        // UX: Replace current route to avoid redirect back to "/" if user goes back after sign in
        await navigateTo(runtimeConfig.public.app.routes.home, { replace: true })
      },
      onError: async (ctx) => {
        // Handle the error
        if (ctx.error.status === 403) {
          useCookie('flash_message__error').value = 'Verify your email address to sign in'
          await navigateTo(`${runtimeConfig.public.app.routes.verifyEmail}?email=${body.email}`)
          console.error(ctx.error.message)
        }
        else {
          errorToast({
            title: 'Sign in Failed',
            description: ctx.error.message,
          })
        }
      },
    })
  }

  async function socialSignIn(provider: 'google' | 'github') {
    // TODO: Check if there's already account with the same email having credentials or magic link
    await authClient.signIn.social({
      provider,
      errorCallbackURL: runtimeConfig.public.app.routes.signIn,
    })

    lastSignInMethod.value = `oauth:${provider}`
  }

  async function sendMagicLink(email: string) {
    await authClient.signIn.magicLink({
      email,
      errorCallbackURL: runtimeConfig.public.app.routes.signIn,
    }).then(() => {
      successToast({
        title: 'Magic link sent',
        description: 'Click on sent link to sign in',
      })
    }).catch((error) => {
      errorToast({
        title: 'Failed to Send Magic Link',
        description: error.data.message || error.message,
      })
    })
  }

  async function sendResetPasswordLink(body: SchemaForgotPassword) {
    await authClient.requestPasswordReset({
      email: body.email,
      redirectTo: '/auth/reset-password',
    }).then(() => {
      successToast({
        title: 'Reset Password Link Sent',
        description: 'Check your email for the reset password link.',
      })
    }).catch((error) => {
      errorToast({
        title: 'Failed to Send Reset Password Link',
        description: error.data.message || error.message,
      })
    })
  }

  async function resetPassword(body: SchemaResetPassword) {
    await authClient.resetPassword({
      newPassword: body.password,
      token: body.token,
    }).then(async () => {
      successToast({
        title: 'Password Reset Successful',
        description: 'Your password has been reset successfully.',
      })

      // UX: Replace current route to avoid reuse of already used reset password link if user goes back
      await navigateTo(runtimeConfig.public.app.routes.signIn)
    }).catch((error) => {
      errorToast({
        title: 'Failed to Reset Password',
        description: error.data.message || error.message,
      })
    })
  }

  return {
    signUp,
    signIn,
    signOut,
    socialSignIn,
    sendVerificationEmail,
    sendMagicLink,
    sendResetPasswordLink,
    resetPassword,

    // user session
    init,
    user,
    isLoading,
  }
})
