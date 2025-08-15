export const createRequest = async <T = any>(url: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Request failed')
  }

  return response.json()
}