// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',          // State management with Pinia
    '@unocss/nuxt',         // Utility-first CSS framework (UnoCSS)
    'vue3-pixi-nuxt',       // Integrating PixiJS with Nuxt 3
  ],

  plugins: [
    { src: '~/plugins/solana.client.js', mode: 'client' }
  ],
  
  vite: {
    define: {
      'process.env': {},  // Polyfill for process.env in the browser
      global: 'window',   // Map global to window for browser compatibility
    },
    resolve: {
      alias: {
        buffer: 'buffer/', // Fix alias issue with buffer
      },
    },
    server: {
      // Proxy API requests to another server during development
      proxy: {
        '/api': 'http://localhost:8080', // Proxy to Go backend
      },
    },
  },
})
