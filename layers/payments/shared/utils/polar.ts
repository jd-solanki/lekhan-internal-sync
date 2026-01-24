import type { DBSelectPolarProduct } from '../schemas/db'

export function extractProductFeaturesFromMetadata(metadata: DBSelectPolarProduct['metadata']) {
  // Loop over metadata keys and if key starts with 'feature_' then its a feature
  return Object.keys(metadata).reduce((features: string[], key) => {
    if (key.startsWith('_ui_feature_')) {
      features.push(metadata[key] as string)
    }
    return features
  }, [])
}

export function extractPreDiscountInCentsFromMetadata(metadata: DBSelectPolarProduct['metadata']): number | null {
  // Loop over metadata keys and if key is 'pre_discount' then immediately return its value
  for (const key of Object.keys(metadata)) {
    if (key === '_ui_pre_discount_in_cents') {
      return Number(metadata[key])
    }
  }

  return null
}
