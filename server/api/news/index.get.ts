import type { NewsApiResponse } from '~/types/news'

// Cache each paginated response briefly so SSR and hydration reuse the same payload.
export default defineCachedEventHandler(async (event): Promise<NewsApiResponse> => {
  const config = useRuntimeConfig()
  const query = getQuery(event)

  if (!config.newsApiBaseUrl || !config.newsApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing News API configuration',
    })
  }

  const baseUrl = config.newsApiBaseUrl.replace(/\/$/, '')

  const params = new URLSearchParams()
  params.append('apikey', config.newsApiKey)
  params.append('size', '10')

  if (query.pageToken) {
    params.append('page', String(query.pageToken))
  }

  const response = await $fetch<NewsApiResponse>(
    `${baseUrl}/latest?${params.toString()}`
  )
  return response
}, {
  maxAge: 60,
})
