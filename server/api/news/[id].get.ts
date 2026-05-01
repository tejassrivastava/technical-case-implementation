import type { NewsApiResponse } from '~/types/news'

export default defineEventHandler(async (event): Promise<NewsApiResponse> => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')

  if (!config.newsApiBaseUrl || !config.newsApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing News API configuration',
    })
  }

  const baseUrl = config.newsApiBaseUrl.replace(/\/$/, '')

  const params = new URLSearchParams()
  params.append('apikey', config.newsApiKey)
  params.append('id', id!)

  const response = await $fetch<NewsApiResponse>(`${baseUrl}/latest?${params.toString()}`)
  return response
})
