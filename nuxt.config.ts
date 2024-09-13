// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  pages: true,
  modules: [
    '@nuxt/ui',
    // '@nuxtjs/supabase',
    '@pinia/nuxt',
    '@vite-pwa/nuxt',
  ],
  runtimeConfig: {
    public: {
      bucketUrl: process.env.BUCKET_URL
    }
  }
})