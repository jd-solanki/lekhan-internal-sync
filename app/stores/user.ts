import type { SchemaForgotPassword, SchemaResetPassword, SchemaSignUp } from '~~/shared/schemas/auth'
import { authClient } from '~/libs/auth'

export const useUserStore = defineStore('user', () => {
  const { errorToast, successToast } = useToastMessage()
  const runtimeConfig = useRuntimeConfig()

  const session = ref<Awaited<ReturnType<typeof authClient.useSession>> | null>(null)
  const lastSignInMethod = useCookie('lastSignInMethod')

  const isAuthInProgress = ref(false)
  const withLoading = createWithLoading(isAuthInProgress)

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
  const isUserAdmin = computed(() => user.value?.role === 'admin')
  const isLoading = computed(() => session.value?.isPending || isAuthInProgress.value)

  async function signUp(body: SchemaSignUp) {
    await withLoading(async () => {
      await authClient.signUp.email({
        ...body,
        name: body.email.split('@')[0] as string, // BetterAuth requires name col
        callbackURL: runtimeConfig.public.app.routes.signIn,
      }, {
        onSuccess: async (_ctx) => {
          lastSignInMethod.value = 'email'

          if (runtimeConfig.public.shared.isEmailVerificationRequiredForAccess) {
            // Send verification mail and redirect to verify email page
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
    })
  }

  // INFO: We don't want to accept redirectTo as `true` value.
  // It can either be redirect URL or false to prevent redirection
  // When nothing is passed it'll be default to redirection to default home URL
  async function signIn(body: SchemaSignIn, options?: { redirectUrl?: string | false, onSuccess?: () => Promise<void> }) {
    const { redirectUrl = runtimeConfig.public.app.routes.home } = options || {}
    await withLoading(async () => {
      await authClient.signIn.email(body, {
        onSuccess: async (_ctx) => {
          // NOTE: We'll always watch for user even if there's no redirection to avoid
          //   executing code before user session is assigned
          watch(user, async () => {
            lastSignInMethod.value = 'email'

            await options?.onSuccess?.()

            // NOTE: We'll only redirect after session is updated to avoid unexpected behavior
            // Only redirect if redirectTo is given
            if (redirectUrl) {
              // UX: Replace current route to avoid redirect back to "/" if user goes back after sign in
              await navigateTo(redirectUrl, { replace: true })
            }
          }, { once: true })
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
    })
  }

  async function signOut() {
    await authClient.signOut()

    // NOTE: We'll only redirect after session is updated to avoid unexpected behavior
    watch(user, async () => {
      await navigateTo(runtimeConfig.public.app.routes.signIn)
    })
  }

  async function socialSignIn(provider: 'google' | 'github') {
    await withLoading(async () => {
      await authClient.signIn.social({
        provider,
        errorCallbackURL: runtimeConfig.public.app.routes.signIn,
        callbackURL: runtimeConfig.public.app.routes.home,
      })
    })

    lastSignInMethod.value = `oauth:${provider}`
  }

  async function sendMagicLink(email: string) {
    await withLoading(async () => {
      await authClient.signIn.magicLink({
        email,
        errorCallbackURL: runtimeConfig.public.app.routes.signIn,
      }).then(async () => {
        successToast({
          title: 'Magic link sent',
          description: 'Click on sent link to sign in',
        })

        // Send verification mail and redirect to verify email page
        await navigateTo(`${runtimeConfig.public.app.routes.verifyEmail}?state=mail-sent`)
      }).catch((error) => {
        errorToast({
          title: 'Failed to Send Magic Link',
          description: error.data.message || error.message,
        })
      })
    })
  }

  async function sendResetPasswordLink(body: SchemaForgotPassword) {
    await withLoading(async () => {
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
    })
  }

  async function resetPassword(body: SchemaResetPassword) {
    await withLoading(async () => {
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
    })
  }

  async function sendVerificationEmail(email: string) {
    await withLoading(async () => {
      await authClient.sendVerificationEmail({ email })
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
    isUserAdmin,
    isLoading,
  }
})
