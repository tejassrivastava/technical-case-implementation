import type { NewsApiResponse } from '~/types/news'

export default defineEventHandler(async (event): Promise<NewsApiResponse> => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')

  const params = new URLSearchParams()
  params.append('apikey', config.newsApiKey)
  params.append('id', id!)

  const response = await $fetch<NewsApiResponse>(`https://newsdata.io/api/1/latest?${params.toString()}`)
  return response
})
