export default defineNuxtConfig({
  compatibilityDate: '2026-01-01',
  devtools: { enabled: true },
  css: ['~/assets/styles/main.scss'],
  runtimeConfig: {
    authEmail: '',
    authPassword: '',
    newsApiKey: process.env.NEWS_API_KEY,
    newsApiBaseUrl: process.env.NEWS_API_BASE_URL,
    public: {},
  },
})
