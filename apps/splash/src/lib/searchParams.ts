/**
 * Creates a URLSearchParams object from an object, filtering out null and undefined values.
 * Keeps falsy values like 0, false, and empty strings.
 * Returns undefined if params is not provided or contains no valid values.
 */
export function createSearchParams(params?: Record<string, any>): URLSearchParams | undefined {
  if (!params) {
    return undefined;
  }
  
  const searchParams = new URLSearchParams();
  
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined) {
      searchParams.set(key, String(value));
    }
  }
  
  // Return undefined if no valid params were added
  if (searchParams.toString() === '') {
    return undefined;
  }
  
  return searchParams;
}