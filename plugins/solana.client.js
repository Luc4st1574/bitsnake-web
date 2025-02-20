import { Connection, clusterApiUrl } from '@solana/web3.js'
import { Buffer } from 'buffer'

export default defineNuxtPlugin(() => {
  if (import.meta.server) return; // Ensure the plugin runs only on the client side

  // Polyfill global Buffer if it's not already defined
  if (typeof globalThis.Buffer === 'undefined') {
    globalThis.Buffer = Buffer
  }

  // Function to retrieve the Phantom Wallet from the global object
  async function getPhantomWallet() {
    while (!globalThis.solana) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
    if (globalThis.solana.isPhantom) {
      return globalThis.solana
    } else {
      console.error('Phantom Wallet not found')
      return null
    }
  }

  // Create a connection to the Solana Devnet
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')

  return {
    provide: {
      phantom: getPhantomWallet(),
      solanaConnection: connection,
    },
  }
})