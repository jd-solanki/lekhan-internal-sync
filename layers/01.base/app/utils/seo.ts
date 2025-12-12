import { titleCase } from 'scule'

export function genPageTitleFromRoutePath(routePath: string, defaultOgImageTitle: string, defaultPageTitle: string): { ogImageTitle: string | undefined, pageTitle: string | undefined } {
  if (!routePath || routePath === '/')
    return { ogImageTitle: defaultOgImageTitle, pageTitle: defaultPageTitle }

  if (routePath === '/app')
    return { ogImageTitle: 'Dashboard', pageTitle: 'Dashboard' }

  /*
    /app/billing => /billing
    /app/account-settings/profile => /account-settings/profile
  */
  let formattedPath: string | undefined = removePrefix(routePath, '/app')

  /*
    /billing => [ 'billing' ]
    /account-settings/profile => [ 'account-settings', 'profile' ]
  */
  const segments = formattedPath.split('/').filter(Boolean)

  /*
    [ 'billing' ] => 'Billing'
    [ 'account-settings', 'profile' ] => 'Profile'
  */
  const lastSegment = segments.at(-1)

  /*
    [ 'billing' ] => [ 'billing' ]
    [ 'account-settings', 'profile' ] => [ 'profile', 'account-settings' ]
  */
  const reversedSegments = segments.toReversed()

  /*
    [ 'billing' ] => [ 'Billing' ]
    [ 'profile', 'account-settings' ] => [ 'Profile', 'Account Settings' ]
  */
  const pageTitleSegments = reversedSegments.map(titleCase)

  /*
    [ 'Billing' ] => 'Billing'
    [ 'Profile', 'Account Settings' ] => 'Profile - Account Settings'
  */
  const pageTitle = pageTitleSegments.join(' - ')

  formattedPath = lastSegment ? titleCase(lastSegment) : lastSegment

  return {
    ogImageTitle: formattedPath,
    pageTitle,
  }
}
