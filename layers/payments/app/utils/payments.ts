export function informSignUpToAccessEntitlementsOnSuccessfulGuestCheckout() {
  /*
  Show toast to sign up for guest checkout Only

  Show info toast to inform user to sign up to access their entitlements after redirect from checkout

  Note that this is loosely secured for intentional UX purpose because even though if someone realizes that
  using `customer_session_token` in URL shows this toast, it doesn't give any advantage without signing up.
*/
  const { infoToast } = useToastMessage()
  const customerSessionToken = getFirstQueryValue('customer_session_token')

  onMounted(() => {
    if (customerSessionToken) {
      infoToast({
        title: 'Create an account with same email to access your entitlements',
      })
    }
  })
}
