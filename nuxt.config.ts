// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  pages: true,
  modules: [
    '@nuxt/ui',
    '@nuxtjs/supabase',
    '@pinia/nuxt',
    '@vite-pwa/nuxt',
  ],
  runtimeConfig: {
    public: {
      bucketUrl: process.env.BUCKET_URL
    },
    openai: {
      apiKey: process.env.NUXT_ENV_OPENAI_API_KEY,  // API key from env
      organizationId: process.env.NUXT_ENV_OPENAI_ORG_ID,  // Org ID from env
      projectId: process.env.NUXT_ENV_OPENAI_PROJECT_ID,  // Project ID from env
    }
  },
  supabase: {
    redirect: false,
  },
  imports: {
    dirs: ['stores']
  },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
    }
  }
})