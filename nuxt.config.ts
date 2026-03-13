import { fileURLToPath } from 'node:url';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/content',
    '@nuxt/image',
    '@nuxthub/core',
    'shadcn-nuxt'
  ],

  hub: {
    db: {
      dialect: 'postgresql',
      connection: {
        connectionString: process.env.DATABASE_URL,
      }
    },
    blob: true
  },

  vite: {
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
      ]
    }
  }
})
