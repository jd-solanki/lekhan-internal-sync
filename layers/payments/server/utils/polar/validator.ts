// We've cloned this from original module repo to adjust it to our needs once module resolves the issue
// Issue: https://github.com/Yizack/nuxt-webhook-validators/issues/14
// Source: https://github.com/Yizack/nuxt-webhook-validators/blob/main/src/runtime/server/lib/validators/polar.ts
import type { H3Event } from 'h3'
import { getRequestHeaders, readRawBody } from 'h3'
import { computeSignature, ensureConfiguration, HMAC_SHA256 } from './webhookValidationHelper'

const POLAR_SIGNATURE_ID = 'webhook-id'
const POLAR_SIGNATURE = 'webhook-signature'
const POLAR_SIGNATURE_TIMESTAMP = 'webhook-timestamp'
const DEFAULT_TOLERANCE = 300 // 5 minutes

/**
 * Validates Polar.sh webhooks on the Edge
 * @see {@link https://docs.polar.sh/api/webhooks#verify-signature}
 * @param event H3Event
 * @returns {boolean} `true` if the webhook is valid, `false` otherwise
 */
export async function isValidPolarWebhookPatched(event: H3Event): Promise<{ isValidWebhook: boolean, rawBody: string | undefined }> {
  const config = ensureConfiguration('polar', event)

  const headers = getRequestHeaders(event)
  const body = await readRawBody(event)

  const webhookId = headers[POLAR_SIGNATURE_ID]
  const webhookSignature = headers[POLAR_SIGNATURE]
  const webhookTimestamp = headers[POLAR_SIGNATURE_TIMESTAMP]

  if (!body || !webhookId || !webhookSignature || !webhookTimestamp)
    return { isValidWebhook: false, rawBody: body }

  // Validate the timestamp to ensure the request isn't too old
  const now = Math.floor(Date.now() / 1000)
  if (now - Number(webhookTimestamp) > DEFAULT_TOLERANCE)
    return { isValidWebhook: false, rawBody: body }

  const payload = `${webhookId}.${webhookTimestamp}.${body}`

  const computedSignature = await computeSignature(config.secretKey, HMAC_SHA256, payload, { encoding: 'base64' })
  return {
    isValidWebhook: computedSignature === webhookSignature.split(',')[1],
    rawBody: body,
  }
}
