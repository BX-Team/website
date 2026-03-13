export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/content',
    '@nuxt/image',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxthub/core',
    'shadcn-nuxt',
    '@nuxt/fonts',
  ],

  hub: {
    db: {
      dialect: 'postgresql',
      connection: {
        connectionString: process.env.DATABASE_URL,
      },
    },
    blob: true,
  },

  components: [{ path: '~/components', pathPrefix: false }],

  shadcn: {
    prefix: '',
    componentDir: '@/components/ui',
  },

  fonts: {
    families: [{ name: 'Inter', provider: 'google' }],
    defaults: {
      weights: [400, 500, 600, 700],
      styles: ['normal'],
    },
  },

  vite: {
    optimizeDeps: {
      include: ['@vue/devtools-core', '@vue/devtools-kit', '@vueuse/core'],
    },
  },
});
