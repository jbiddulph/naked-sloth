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
  pwa: {
    manifest: {
      name: 'Rapr generator from NakedSloth',
      short_name: 'App',
      description: 'A rap generation app that you can design and post',
      background_color: '#ffffff',
      theme_color: '#000000',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    registerType: 'autoUpdate',
    workbox: {
      navigateFallback: '/', // Use the root route as fallback
      runtimeCaching: [
        {
          urlPattern: '/',
          handler: 'NetworkFirst', // Handle the homepage as NetworkFirst
          options: {
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        {
          urlPattern: /.*\.(?:js|css|html|png|jpg|svg|webp)$/,
          handler: 'StaleWhileRevalidate', // Cache static assets
          options: {
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        }
      ],
      debug: true,
    },
  },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
    }
  },
})
