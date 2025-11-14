import type { FetchError } from 'ofetch'
import type { SocialProviderId } from '~~/server/libs/auth'
import type { SchemaForgotPassword, SchemaResetPassword, SchemaSignUp } from '~~/shared/schemas/auth'
import type { User } from '~/libs/auth'
import { authClient } from '~/libs/auth'

export const useUserStore = defineStore('user', () => {
  const { errorToast, successToast, infoToast } = useToastMessage()
  const runtimeConfig = useRuntimeConfig()

  const session = ref<Awaited<ReturnType<typeof authClient.useSession>> | null>(null)

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

  const refetchUserSessionData = async () => {
    const { data } = await authClient.getSession()

    if (!session.value)
      return

    session.value.data = data
  }

  const user = computed(() => session.value?.data?.user as User | undefined)
  const userSession = computed(() => session.value?.data?.session)
  const isUserAdmin = computed(() => user.value?.role === 'admin')
  const isLoading = computed(() => session.value?.isPending || isAuthInProgress.value)

  const impersonateUser = async (userId: number) => {
    const response = await authClient.admin.impersonateUser({ userId })

    if (response.error) {
      errorToast({
        title: 'Impersonation Failed',
        description: response.error.message,
      })
      return
    }

    await refetchUserSessionData()
    await navigateTo(runtimeConfig.public.app.routes.home)
  }

  const stopImpersonating = async () => {
    const response = await authClient.admin.stopImpersonating()

    if (response.error) {
      errorToast({
        title: 'Stop Impersonation Failed',
        description: response.error.message,
      })
      return
    }

    await refetchUserSessionData()
    await navigateTo(runtimeConfig.public.app.routes.home)
  }

  async function signUp(body: SchemaSignUp) {
    await withLoading(async () => {
      await authClient.signUp.email({
        ...body,
        name: body.email.split('@')[0] as string, // BetterAuth requires name col
        callbackURL: runtimeConfig.public.app.routes.signIn,
      }, {
        onSuccess: async (_ctx) => {
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
            if (ctx.error.code === 'BANNED_USER') {
              errorToast({
                title: 'Forbidden',
                description: 'Your account has been banned. Please contact support for more information.',
              })
            }
            else if (ctx.error.code === 'EMAIL_NOT_VERIFIED') {
              infoToast({ title: 'Verify your email address to sign in' })
              await navigateTo(`${runtimeConfig.public.app.routes.verifyEmail}?email=${body.email}`)
              console.error(ctx.error.message)
            }
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
    // eslint-disable-next-line regex/invalid
    await authClient.signOut()

    // NOTE: We'll only redirect after session is updated to avoid unexpected behavior
    watch(user, async () => {
      await navigateTo(runtimeConfig.public.app.routes.signIn)
    })
  }

  async function socialSignIn(provider: SocialProviderId) {
    await withLoading(async () => {
      await authClient.signIn.social({
        provider,
        errorCallbackURL: runtimeConfig.public.app.routes.signIn,
        callbackURL: runtimeConfig.public.app.routes.home,
      })
    })
  }

  async function sendMagicLink(email: string) {
    await withLoading(async () => {
      try {
        await authClient.signIn.magicLink({
          email,
          errorCallbackURL: runtimeConfig.public.app.routes.signIn,
        })

        successToast({
          title: 'Magic link sent',
          description: 'Click on sent link to sign in',
        })

        // Send verification mail and redirect to verify email page
        await navigateTo(`${runtimeConfig.public.app.routes.verifyEmail}?state=mail-sent`)
      }
      catch {
        errorToast({
          title: 'Failed to Send Magic Link',
          // description: error?.data?.message || error?.message || 'Unable to send magic link. Please try again.' },
        })
      }
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

  async function deactivateUser(userId: number, name?: string) {
    // Deactivate user by setting `deactivatedAt` col to current timestamp
    // Call API to deactivate user
    return $fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      body: {
        deactivatedAt: new Date(),
      },
    }).then(async () => {
      successToast({
        title: `User "${name || userId}" has been deactivated`,
      })
    }).catch((e) => {
      const error = e as FetchError
      errorToast({
        title: 'Failed to deactivate user',
        description: error.statusMessage || 'Unable to deactivate this user.',
      })
    })
  }

  async function reactivateUser(userId: number, name?: string) {
    // Reactivate user by setting `deactivatedAt` col to null
    // Call API to reactivate user
    return $fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      body: {
        deactivatedAt: null,
      },
    }).then(async () => {
      successToast({
        title: `User "${name || userId}" has been reactivated`,
      })
    }).catch((e) => {
      const error = e as FetchError
      errorToast({
        title: 'Error',
        description: error.statusMessage || 'Unable to reactivate this user.',
      })
    })
  }

  async function deactivateCurrentAccount() {
    try {
      await $fetch('/api/users/deactivate', {
        method: 'POST',
      })

      // Revoke all user sessions
      await authClient.revokeSessions()

      successToast({
        title: 'Account deactivated',
        description: 'Your account has been deactivated. You can reactivate it by signing in again.',
      })

      await signOut()
    }
    catch (e) {
      const error = e as FetchError
      errorToast({
        title: 'Error',
        description: error.statusMessage || 'Unable to deactivate your account.',
      })
    }
  }

  async function banUser(banOptions: Parameters<typeof authClient.admin.banUser>[0], name: string) {
    const banRes = await authClient.admin.banUser(banOptions)

    if (banRes?.error) {
      errorToast({
        title: 'Failed to ban user',
        description: banRes.error.message || 'You cannot ban this user.',
      })
    }
    else {
      successToast({
        title: `User "${name || banOptions.userId}" has been banned`,
        description: banOptions.banExpiresIn ? `Ban Expires at ${new Date(Date.now() + banOptions.banExpiresIn * 1000).toLocaleString()}` : 'Ban is permanent',
      })
    }

    return banRes
  }

  async function liftBan(unbanOptions: Parameters<typeof authClient.admin.unbanUser>[0], name: string) {
    const unbanRes = await authClient.admin.unbanUser({
      userId: unbanOptions.userId,
    })

    if (unbanRes?.error) {
      errorToast({
        title: 'Failed to lift ban',
        description: unbanRes.error.message || 'Unable to lift ban for this user.',
      })
    }
    else {
      successToast({
        title: `Ban lifted for user "${name || unbanOptions.userId}"`,
      })
    }

    return unbanRes
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
    userSession,
    isUserAdmin,
    isLoading,

    // Account management
    deactivateCurrentAccount,

    // Admin action
    impersonateUser,
    stopImpersonating,
    deactivateUser,
    reactivateUser,
    banUser,
    liftBan,
  }
})
