/**
 * Creates a URLSearchParams object from an object, filtering out null and undefined values.
 * Keeps falsy values like 0, false, and empty strings.
 */
export function createSearchParams(params: Record<string, any>): URLSearchParams {
  const searchParams = new URLSearchParams();
  
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined) {
      searchParams.set(key, String(value));
    }
  }
  
  return searchParams;
}