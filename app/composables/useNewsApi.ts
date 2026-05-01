import type { NewsApiResponse } from '~/types/news'


export function useFetchArticles(pageToken: Ref<string | null | undefined>) {
  return useFetch<NewsApiResponse>(
    () => {
      const token = pageToken.value
      const params = token ? { nextPage: token } : {}
      return `/api/news${params.nextPage ? `?nextPage=${encodeURIComponent(params.nextPage)}` : ''}`
    },     
    { watch: [pageToken] },
  )
}

export function useFetchArticleById(id: string) {
  return useFetch<NewsApiResponse>(`/api/news/${id}`)
}
