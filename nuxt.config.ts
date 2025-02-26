import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2025-02-20',
  
  runtimeConfig: {
    public: {
      VITE_WS_SERVER: process.env.VITE_WS_SERVER || 'ws://localhost:8080'
    }
  },

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
  },
})
