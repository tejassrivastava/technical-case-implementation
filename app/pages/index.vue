<script setup lang="ts">
import type { LocationQueryValue } from 'vue-router'

const route = useRoute()
const router = useRouter()
const isPageTransitioning = ref(false)

function normalizeQueryToken(value: LocationQueryValue | LocationQueryValue[] | undefined): string | null {
  if (Array.isArray(value)) {
    return normalizeQueryToken(value[0])
  }

  if (typeof value !== 'string') {
    return null
  }

  const trimmedValue = value.trim()
  return trimmedValue.length > 0 ? trimmedValue : null
}

const pageToken = computed<string | null | undefined>({
  get() {
    return normalizeQueryToken(route.query.pageToken)
  },
  set(value) {
    const normalizedValue = normalizeQueryToken(value)
    const currentValue = normalizeQueryToken(route.query.pageToken)

    if (normalizedValue === currentValue || isPageTransitioning.value) {
      return
    }

    const nextQuery = { ...route.query }

    if (normalizedValue) {
      nextQuery.pageToken = normalizedValue
    } else {
      delete nextQuery.pageToken
    }

    isPageTransitioning.value = true
    void router.push({ query: nextQuery }).finally(() => {
      isPageTransitioning.value = false
    })
  },
})

const { data, status, error } = await useFetchArticles(pageToken)

const articles = computed(() => {
  if (data.value?.status !== 'success') return []
  return data.value.results
})

const isPaginationReady = computed(() => status.value === 'success' && !isPageTransitioning.value)
const canGoNext = computed(() => isPaginationReady.value && !!data.value?.nextPage)
const canGoPrev = computed(() => isPaginationReady.value && !!pageToken.value)

function goNext() {
  if (status.value === 'pending' || isPageTransitioning.value) return

  const nextToken = normalizeQueryToken(data.value?.nextPage)
  if (!nextToken) return

  pageToken.value = nextToken
}

function goPrev() {
  if (status.value === 'pending' || isPageTransitioning.value || !pageToken.value) return

  pageToken.value = null
}

useSeoMeta({
  title: 'NewsHub — Latest News',
  ogTitle: 'NewsHub — Latest News',
  description: 'Stay up to date with the latest news from around the world.',
  ogDescription: 'Stay up to date with the latest news from around the world.',
})
</script>

<template>
  <div class="news-list">
    <div class="news-list__header">
      <h1 class="news-list__title">Latest News</h1>
      <p class="news-list__subtitle">Stories from around the world, updated in real time</p>
    </div>

    <div v-if="status === 'pending'" class="news-list__loader">
      <div class="news-list__loader-grid">
        <div v-for="n in 10" :key="n" class="skeleton-card" />
      </div>
    </div>

    <div v-else-if="status === 'error'" class="news-list__error">
      <p>Failed to load articles. Please try again later.</p>
    </div>

    <div v-else>
      <div class="news-list__grid">
        <ArticleCard
          v-for="article in articles"
          :key="article.article_id"
          :article="article"
        />
      </div>
    </div>

    <ThePagination
      :can-go-prev="canGoPrev"
      :can-go-next="canGoNext"
      @prev="goPrev"
      @next="goNext"
    />
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:color';

.news-list__header {
  margin-bottom: 40px;
}

.news-list__title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a2e;
  letter-spacing: -0.02em;

  @media (max-width: 640px) {
    font-size: 1.5rem;
  }
}

.news-list__subtitle {
  margin-top: 4px;
  font-size: 1rem;
  color: #6b7280;
}

.news-list__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.news-list__loader-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.skeleton-card {
  height: 340px;
  border-radius: 12px;
  background: linear-gradient(90deg, #e5e7eb 25%, color.adjust(#e5e7eb, $lightness: 3%) 50%, #e5e7eb 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.news-list__error {
  text-align: center;
  padding: 64px;
  color: #6b7280;
}
</style>
