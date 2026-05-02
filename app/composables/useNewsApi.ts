import type { NewsApiResponse } from '~/types/news'

const DEFAULT_NEWS_RESPONSE: NewsApiResponse = {
  status: 'pending',
  totalResults: 0,
  results: [],
  nextPage: null,
}

export function useFetchArticles(pageToken: Ref<string | null | undefined>) {
  const normalizedPageToken = computed(() => pageToken.value?.trim() || null)
  const fetchKey = computed(() => `news-articles:${normalizedPageToken.value ?? 'first'}`)

  return useFetch<NewsApiResponse>('/api/news', {
    key: fetchKey,
    query: computed(() => normalizedPageToken.value ? { pageToken: normalizedPageToken.value } : undefined),
    default: () => ({ ...DEFAULT_NEWS_RESPONSE }),
    getCachedData(key, nuxtApp) {
      return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key]
    },
    watch: [normalizedPageToken],
  })
}

export function useFetchArticleById(id: string) {
  return useFetch<NewsApiResponse>(`/api/news/${id}`)
}
