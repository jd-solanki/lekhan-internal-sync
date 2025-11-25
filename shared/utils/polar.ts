export function extractProductFeaturesFromMetadata(metadata: any) {
  // Loop over metadata keys and if key starts with 'feature_' then its a feature
  return Object.keys(metadata).reduce((features: string[], key) => {
    if (key.startsWith('feature_')) {
      features.push(metadata[key])
    }
    return features
  }, [])
}
