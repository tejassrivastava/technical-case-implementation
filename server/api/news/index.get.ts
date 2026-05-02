import type { NewsApiResponse } from '~/types/news'

const fetchNews = cachedFunction(
  async (apiKey: string, pageToken?: string): Promise<NewsApiResponse> => {
    const params = new URLSearchParams()
    params.append('apikey', apiKey)
    params.append('size', '10')
    if (pageToken) {
      params.append('page', pageToken)
    }
    return $fetch<NewsApiResponse>(
      `https://newsdata.io/api/1/latest?${params.toString()}`
    )
  },
  {
    maxAge: 60,
    name: 'news-list',
    getKey: (_, pageToken) => `news-list:${pageToken ?? 'first'}`,
  }
)

export default defineEventHandler(async (event): Promise<NewsApiResponse> => {
  const config = useRuntimeConfig()

  if (!config.newsApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing News API configuration',
    })
  }

  const query = getQuery(event)
  const pageToken = query.pageToken ? String(query.pageToken) : undefined

  const result = await fetchNews(config.newsApiKey, pageToken)

  if (!result) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Failed to fetch news',
    })
  }

  return result
})