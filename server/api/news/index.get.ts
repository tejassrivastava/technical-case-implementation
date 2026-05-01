import type { NewsApiResponse } from '~/types/news'

export default defineEventHandler(async (event): Promise<NewsApiResponse> => {
  const config = useRuntimeConfig()
  const query = getQuery(event)

  const params = new URLSearchParams()
  params.append('apikey', config.newsApiKey)
  params.append('size', '10')

  if (query.nextPage) {
    params.append('page', String(query.nextPage))
  }

  const response = await $fetch<NewsApiResponse>(
    `https://newsdata.io/api/1/latest?${params.toString()}`
  )
  return response
})