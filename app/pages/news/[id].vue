<script setup lang="ts">
const route = useRoute()
const id = route.params.id as string

const { data, status } = await useFetchArticleById(id)

const article = computed(() => data.value?.results[0]!)
const { setContext } = useLoginModal()

useSeoMeta({
  title: () => article.value?.title ?? 'Article',
  description: () => article.value?.description ?? '',
  ogImage: () => article.value?.image_url ?? undefined,
})

onMounted(() => {
  if (article.value?.title) {
    setContext(article.value.title)
  }
})

onUnmounted(() => {
  setContext(null)
})
</script>

<template>
  <div class="article-detail">
    <NuxtLink to="/" class="article-detail__back">
      <span>←</span>
      Back to News
    </NuxtLink>

    <div v-if="status === 'pending'" class="article-detail__loader">
      <div class="skeleton skeleton--title" />
      <div class="skeleton skeleton--image" />
      <div class="skeleton skeleton--text" />
      <div class="skeleton skeleton--text skeleton--text-short" />
    </div>

    <div v-else-if="status === 'error'" class="article-detail__error">
      <p>Failed to load the article. Please try again later.</p>
      <NuxtLink to="/" class="article-detail__back-btn">Return to Home</NuxtLink>
    </div>

    <article v-else-if="article" class="article-detail__content">
      <div class="article-detail__meta">
        <span class="article-detail__source">{{ article.source_name }}</span>
        <span class="article-detail__dot">·</span>
        <time class="article-detail__date">{{ article.pubDate.slice(0, 10) }}</time>
        <span v-if="article.language" class="article-detail__lang">
          {{ article.language.toUpperCase() }}
        </span>
      </div>

      <h1 class="article-detail__title">{{ article.title }}</h1>

      <div class="article-detail__categories">
        <span
          v-for="cat in article.category"
          :key="cat"
          class="article-detail__category"
        >
          {{ cat }}
        </span>
      </div>

      <div v-if="article.image_url" class="article-detail__image-wrap">
        <img
          :src="article.image_url"
          :alt="article.title!"
          class="article-detail__image"
        />
      </div>

      <p v-if="article.description" class="article-detail__description">
        {{ article.description }}
      </p>

      <a
        v-if="article.link"
        :href="article.link"
        target="_blank"
        rel="noopener noreferrer"
        class="article-detail__read-more"
      >
        Read full article
        <span>→</span>
      </a>
    </article>

    <div v-else class="article-detail__error">
      <p>Article not found.</p>
      <NuxtLink to="/" class="article-detail__back-btn">Return to Home</NuxtLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.article-detail {
  max-width: 780px;
  margin: 0 auto;
}

.article-detail__back {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 40px;
  transition: color 0.2s ease;

  &:hover {
    color: #e94560;
  }
}

.article-detail__content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.article-detail__meta {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}

.article-detail__source {
  font-size: 0.875rem;
  font-weight: 600;
  color: #e94560;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.article-detail__dot {
  color: #9ca3af;
}

.article-detail__date {
  font-size: 0.875rem;
  color: #9ca3af;
}

.article-detail__lang {
  font-size: 0.75rem;
  color: #ffffff;
  background-color: #2d2d4e;
  padding: 2px 4px;
  border-radius: 6px;
  letter-spacing: 0.06em;
}

.article-detail__title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a2e;
  line-height: 1.25;
  letter-spacing: -0.02em;

  @media (max-width: 640px) {
    font-size: 1.5rem;
  }
}

.article-detail__categories {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.article-detail__category {
  font-size: 0.75rem;
  color: #6b7280;
  background-color: #f4f5f7;
  border: 1px solid #e5e7eb;
  padding: 2px 8px;
  border-radius: 6px;
  text-transform: capitalize;
}

.article-detail__image-wrap {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.article-detail__image {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

.article-detail__description {
  font-size: 1.125rem;
  color: #6b7280;
  line-height: 1.75;
  border-left: 3px solid #e94560;
  padding-left: 24px;
}

.article-detail__read-more {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 24px;
  background-color: #e94560;
  color: #ffffff;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  transition: background-color 0.2s ease, transform 0.2s ease;
  align-self: flex-start;

  &:hover {
    background-color: #c73550;
    transform: translateY(-1px);
  }
}

.article-detail__loader {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.skeleton {
  border-radius: 6px;
  background: linear-gradient(90deg, #e5e7eb 25%, lighten(#e5e7eb, 3%) 50%, #e5e7eb 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;

  &--title {
    height: 56px;
    width: 80%;
  }

  &--image {
    height: 420px;
    border-radius: 12px;

    @media (max-width: 640px) {
      height: 220px;
    }
  }

  &--text {
    height: 20px;
  }

  &--text-short {
    width: 60%;
  }
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.article-detail__error {
  text-align: center;
  padding: 64px;
  color: #6b7280;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.article-detail__back-btn {
  padding: 8px 24px;
  background-color: #1a1a2e;
  color: #ffffff;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #2d2d4e;
  }
}
</style>
