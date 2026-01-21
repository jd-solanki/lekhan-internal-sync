export function normalizeToMonthlyPrice(priceAmount: number, interval: string | null): number {
  if (!interval || interval === 'month') {
    return priceAmount
  }

  if (interval === 'year') {
    return Math.round(priceAmount / 12)
  }

  return priceAmount
}

/**
 * Extract tier order from product metadata.
 * Throws error if _ui_tier_order not present.
 */
export function extractTierOrderFromMetadata(metadata: Record<string, unknown>): number {
  const tierOrder = metadata._ui_tier_order

  if (tierOrder === undefined || tierOrder === null) {
    throw new Error('Product metadata missing required _ui_tier_order field')
  }

  const parsed = typeof tierOrder === 'string' ? Number.parseInt(tierOrder, 10) : Number(tierOrder)

  if (Number.isNaN(parsed)) {
    throw new TypeError(`Invalid _ui_tier_order value: ${tierOrder}`)
  }

  return parsed
}

/**
 * Determine upgrade/downgrade based on tier & interval.
 * Decision rules:
 * 1. Tier comparison takes precedence
 * 2. For same tier: yearly > monthly (upgrade to yearly, downgrade to monthly)
 */
export function determinePlanChangeType(
  currentTier: number,
  currentInterval: string | null,
  targetTier: number,
  targetInterval: string | null,
): 'upgrade' | 'downgrade' {
  // Tier comparison takes precedence
  if (targetTier > currentTier) {
    return 'upgrade'
  }

  if (targetTier < currentTier) {
    return 'downgrade'
  }

  // Same tier: interval comparison
  // yearly > monthly (longer commitment = upgrade)
  if (currentInterval === 'month' && targetInterval === 'year') {
    return 'upgrade'
  }

  if (currentInterval === 'year' && targetInterval === 'month') {
    return 'downgrade'
  }

  // Same tier, same interval (shouldn't happen, but default to upgrade)
  return 'upgrade'
}
