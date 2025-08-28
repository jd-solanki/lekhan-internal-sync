export const formatPolarAmount = (amount: number) => `$${((amount || 0) / 100).toFixed(2)}`
