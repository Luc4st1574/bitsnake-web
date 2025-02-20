<script setup>
import { useHead } from '#imports'
import { ref, onMounted } from 'vue'
import { useNuxtApp, useRouter } from '#app'
import { PublicKey, Transaction, SystemProgram } from '@solana/web3.js'

const phantom = ref(null)
const publicWalletAddress = ref('')
const isSending = ref(false)
const transactionSignature = ref('')

const receiverWalletAddress = 'D7LwfYCjLLCaeLTTijwBagFAmB3aPSm2Fx8K2DzvqLrz'
const paymentAmount = 0.3

const router = useRouter()

onMounted(async () => {
  const { $phantom } = useNuxtApp()
  phantom.value = await $phantom
})

useHead({
  title: 'BitSnake',
  meta: [
    { charset: 'UTF-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
    { rel: 'manifest', href: '/site.webmanifest' }
  ]
})
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-light text-dark p-4">
    <div v-if="!publicWalletAddress">
      <button @click="connectPhantom" class="bg-primary text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-secondary transition">
        Connect to Phantom Wallet
      </button>
    </div>

    <div v-if="publicWalletAddress" class="mt-6 text-center">
      <p class="text-2xl font-semibold text-primary">Welcome to the Solana Network</p>
      <p class="mt-2 text-lg font-mono bg-gray-100 px-4 py-2 rounded-lg shadow-sm">{{ publicWalletAddress }}</p>
      <button 
        @click="sendPayment" 
        class="mt-6 bg-success text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-green-700 transition"
        :disabled="isSending"
      >
        {{ isSending ? 'Sending Payment...' : 'Send 0.3 SOL' }}
      </button>
    </div>
  </div>
</template>
