<script setup>
import { ref, onMounted } from 'vue'
import { useNuxtApp, useRouter } from '#app'
import { PublicKey, Transaction, SystemProgram } from '@solana/web3.js'
import { useGameStore } from '@/stores/game'

const phantom = ref(null)
const publicWalletAddress = ref('')
const isSending = ref(false)
const transactionSignature = ref('')

const receiverWalletAddress = 'D7LwfYCjLLCaeLTTijwBagFAmB3aPSm2Fx8K2DzvqLrz'
const paymentAmount = 0.3

const router = useRouter()
const gameStore = useGameStore()

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

// Function to send SOL payment.
async function sendPayment() {
  if (!phantom.value || !publicWalletAddress.value) {
    alert('Please connect your Phantom Wallet first!')
    return
  }
  try {
    isSending.value = true  // immediately switch to processing mode

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

    transactionSignature.value = signature
    console.log(`Transaction Signature: ${signature}`)
    
    alert(`Payment of ${paymentAmount} SOL sent successfully! Transaction: ${signature}`)
    
    // Delay before verifying payment on the backend
    setTimeout(async () => {
      await verifyPaymentOnBackend(signature)
    }, 10000)

  } catch (error) {
    console.error('Payment failed:', error)
    alert('Payment failed. Please try again.')
    isSending.value = false // revert to normal view if payment fails
  }
}

// Function to verify the payment with the backend.
async function verifyPaymentOnBackend(signature) {
  try {
    const payload = {
      senderWallet: publicWalletAddress.value,
      expectedAmount: paymentAmount,
      transactionHash: signature,
    }
    
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
    data.paid = true;
    localStorage.setItem('sessionData', JSON.stringify(data))
    // Navigate to LoadingPage (room initialization)
    router.push('/LoadingPage')
    
  } catch (error) {
    console.error('Backend verification failed:', error)
    alert('Payment verification failed on the server.')
    isSending.value = false // revert to normal view on failure
  }
}
</script>

<template>
  <!-- When payment is processing, show only the processing message -->
  <div v-if="isSending" class="processing-wrapper">
    <p class="processing-text">
      Payment Processing<span class="dots"></span>
    </p>
  </div>
  
  <!-- Normal view: show wallet connection and payment button only when not processing -->
  <div v-else class="flex flex-col items-center justify-center min-h-screen bg-light text-dark p-4">
    <div v-if="!publicWalletAddress">
      <button 
        @click="connectPhantom" 
        class="bg-primary text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-secondary transition"
      >
        Connect to Phantom Wallet
      </button>
    </div>
    <div v-if="publicWalletAddress" class="mt-6 text-center">
      <p class="text-2xl font-semibold text-primary">Welcome to the Solana Network</p>
      <p class="mt-2 text-lg font-mono bg-gray-100 px-4 py-2 rounded-lg shadow-sm">
        {{ publicWalletAddress }}
      </p>
      <button 
        @click="sendPayment" 
        class="mt-6 bg-success text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-green-700 transition"
      >
        Pay 0.3 SOL &amp; Join Game
      </button>
    </div>
  </div>
</template>

<style scoped>
.processing-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: var(--color-light, #f8fafc);
  color: var(--color-primary, #9333ea);
}

.processing-text {
  font-size: 2.5rem;
  font-weight: bold;
}

.dots::after {
  content: '';
  display: inline-block;
  width: 1em;
  animation: ellipsis 1.5s infinite;
}

@keyframes ellipsis {
  0%   { content: ''; }
  33%  { content: '.'; }
  66%  { content: '..'; }
  100% { content: '...'; }
}
</style>