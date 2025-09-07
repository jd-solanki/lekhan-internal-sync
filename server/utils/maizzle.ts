import { render } from '@maizzle/framework'
import { defu } from 'defu'
import appConfig from '~~/app/app.config'
import maizzleConfigDev from '~~/emails/config'
import maizzleConfigProd from '~~/emails/config.production'
import env from '~~/shared/libs/env'

export async function renderEmail(html: string, pageVariables: Record<string, any> = {}) {
  return await render(
    html,
    {
      ...defu(maizzleConfigDev, maizzleConfigProd),
      locals: {
        page: pageVariables,
        appConfig,
        env,
      },
    },
  )
}
