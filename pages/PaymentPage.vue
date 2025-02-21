<script setup>
import { ref, onMounted } from 'vue'
import { useNuxtApp, useRouter } from '#app'
import { PublicKey, Transaction, SystemProgram } from '@solana/web3.js'

// Reactive state variables
const phantom = ref(null)
const publicWalletAddress = ref('')
const isSending = ref(false)
// Remove sessionData from here if you plan to display it on another page
// const sessionData = ref(null)
const transactionSignature = ref('') // Store transaction signature

// Receiver wallet and payment amount (matches Go backend)
const receiverWalletAddress = 'D7LwfYCjLLCaeLTTijwBagFAmB3aPSm2Fx8K2DzvqLrz'
const paymentAmount = 1.0  // Ensure it's a float

const router = useRouter()

onMounted(async () => {
  const { $phantom } = useNuxtApp()
  phantom.value = await $phantom
})

// Function to connect to Phantom Wallet.
async function connectPhantom() {
  if (!phantom.value) {
    alert('Phantom Wallet is not available. Please install it from https://phantom.app/')
    return
  }
  try {
    const response = await phantom.value.connect({ onlyIfTrusted: false })
    publicWalletAddress.value = response.publicKey.toString()
    console.log('Connected with Public Key:', publicWalletAddress.value)
  } catch (error) {
    console.error('Failed to connect Phantom Wallet:', error)
  }
}

// Function to send 1 SOL payment.
async function sendPayment() {
  if (!phantom.value || !publicWalletAddress.value) {
    alert('Please connect your Phantom Wallet first!')
    return
  }
  try {
    isSending.value = true

    const { $solanaConnection } = useNuxtApp()
    const senderPublicKey = new PublicKey(publicWalletAddress.value)
    const receiverPublicKey = new PublicKey(receiverWalletAddress)

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: senderPublicKey,
        toPubkey: receiverPublicKey,
        lamports: paymentAmount * 1e9, // Convert SOL to lamports
      })
    )

    transaction.feePayer = senderPublicKey
    const { blockhash } = await $solanaConnection.getRecentBlockhash()
    transaction.recentBlockhash = blockhash

    // Sign the transaction using Phantom
    const signedTransaction = await phantom.value.signTransaction(transaction)
    const signature = await $solanaConnection.sendRawTransaction(signedTransaction.serialize())
    await $solanaConnection.confirmTransaction(signature, 'confirmed')

    transactionSignature.value = signature  // Store the transaction signature
    console.log(`Transaction Signature: ${signature}`)
    
    alert(`Payment of ${paymentAmount} SOL sent successfully! Transaction: ${signature}`)
    
    // Add a delay (10 seconds) before verifying payment on the backend
    setTimeout(async () => {
      await verifyPaymentOnBackend(signature)
    }, 10000)

  } catch (error) {
    console.error('Payment failed:', error)
    alert('Payment failed. Please try again.')
  } finally {
    isSending.value = false
  }
}

// Function to verify the payment with the backend.
async function verifyPaymentOnBackend(signature) {
  try {
    const payload = {
      senderWallet: publicWalletAddress.value,
      expectedAmount: paymentAmount, // Send as float
      transactionHash: signature,
    }
    
    // Log the payload being sent to the server.
    console.log("Payload being sent to the server:", payload);

    const response = await fetch('http://localhost:8080/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', 
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Verification failed')
    }

    const data = await response.json()
    console.log("Payment verified successfully! Session data:", data)
    // Save the session data (for example, to localStorage)
    localStorage.setItem('sessionData', JSON.stringify(data))
    // Redirect to a new page (e.g., /dashboard)
    router.push('/GamePage')
    
  } catch (error) {
    console.error('Backend verification failed:', error)
    alert('Payment verification failed on the server.')
  }
}

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
