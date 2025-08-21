export function getFirstQueryValue(key: string, options?: { route: ReturnType<typeof useRoute> }): string | undefined {
  const { route = useRoute() } = options || {}

  let value = route.query[key]
  if (Array.isArray(value)) {
    value = value.length > 0 ? value[0] : undefined
  }

  return value && value.trim() !== '' ? value : undefined
}
