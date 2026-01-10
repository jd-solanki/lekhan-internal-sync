export function extractProductFeaturesFromMetadata(metadata: any) {
  // Loop over metadata keys and if key starts with 'feature_' then its a feature
  return Object.keys(metadata).reduce((features: string[], key) => {
    if (key.startsWith('feature_')) {
      features.push(metadata[key])
    }
    return features
  }, [])
}

export function extractPreDiscountInCentsFromMetadata(metadata: any): number | null {
  // Loop over metadata keys and if key is 'pre_discount' then immediately return its value
  for (const key of Object.keys(metadata)) {
    if (key === 'pre_discount_in_cents') {
      return Number(metadata[key])
    }
  }

  return null
}
