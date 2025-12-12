/**
 * Removes a specified prefix from the beginning of a string.
 *
 * @remarks
 * If the string does not start with the prefix, the original string is returned.
 * If the input is `null` or `undefined`, an empty string is returned.
 *
 * @param str - The input string to process.
 * @param prefix - The prefix string to remove.
 * @returns The string without the prefix, or an empty string if input was invalid.
 *
 * @example
 * removePrefix("mister_bond", "mister_"); // returns "bond"
 * removePrefix("doctor_who", "mister_"); // returns "doctor_who"
 * removePrefix(null, "mister_"); // returns ""
 */
export function removePrefix(str: string | null | undefined, prefix: string): string {
  if (!str)
    return ''

  if (str.startsWith(prefix)) {
    return str.slice(prefix.length)
  }
  return str
}

/**
 * Removes a specified suffix from the end of a string.
 *
 * @remarks
 * If the string does not end with the suffix, the original string is returned.
 * If the input is `null` or `undefined`, an empty string is returned.
 *
 * @param str - The input string to process.
 * @param suffix - The suffix string to remove.
 * @returns The string without the suffix, or an empty string if input was invalid.
 *
 * @example
 * removeSuffix("image.png", ".png"); // returns "image"
 * removeSuffix("image.jpg", ".png"); // returns "image.jpg"
 * removeSuffix(undefined, ".png"); // returns ""
 */
export function removeSuffix(str: string | null | undefined, suffix: string): string {
  if (!str)
    return ''

  if (suffix.length > 0 && str.endsWith(suffix)) {
    return str.slice(0, str.length - suffix.length)
  }
  return str
}
