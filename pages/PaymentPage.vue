<!-- pages/PaymentPage.vue -->
<template>
  <div class="min-h-screen bg-light text-dark p-4">
    <div v-if="!publicWalletAddress">
      <button @click="connectPhantom" class="bg-primary text-light px-4 py-2 rounded shadow">
        Connect to Phantom Wallet
      </button>
    </div>
    <div v-else>
      <p class="mt-2">Wallet: {{ publicWalletAddress }}</p>
      <button @click="sendPayment" class="bg-success text-light px-4 py-2 rounded shadow mt-4" :disabled="isSending">
        {{ isSending ? 'Processing Payment...' : 'Pay 0.3 SOL & Join Game' }}
      </button>
    </div>

    <!-- Loading overlay -->
    <LoadingPage v-if="loading" ref="loadingPage" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useNuxtApp, useRouter } from '#app'
import { PublicKey, Transaction, SystemProgram } from '@solana/web3.js'
import LoadingPage from '@/components/LoadingPage.vue'
import { useRoom } from '../game/Client'
import { useGameStore } from '@/stores/game'

const phantom = ref(null)
const publicWalletAddress = ref('')
const isSending = ref(false)
const loading = ref(false)
const router = useRouter()
const gameStore = useGameStore()

const { $phantom, $solanaConnection } = useNuxtApp()

onMounted(async () => {
  phantom.value = await $phantom
})

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

async function sendPayment() {
  if (!phantom.value || !publicWalletAddress.value) {
    alert('Please connect your Phantom Wallet first!')
    return
  }
  try {
    isSending.value = true
    const senderPublicKey = new PublicKey(publicWalletAddress.value)
    const receiverWalletAddress = 'D7LwfYCjLLCaeLTTijwBagFAmB3aPSm2Fx8K2DzvqLrz'
    const receiverPublicKey = new PublicKey(receiverWalletAddress)
    const paymentAmount = 0.3

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: senderPublicKey,
        toPubkey: receiverPublicKey,
        lamports: paymentAmount * 1e9,
      })
    )
    transaction.feePayer = senderPublicKey
    const { blockhash } = await $solanaConnection.getRecentBlockhash()
    transaction.recentBlockhash = blockhash

    const signedTransaction = await phantom.value.signTransaction(transaction)
    const signature = await $solanaConnection.sendRawTransaction(signedTransaction.serialize())
    await $solanaConnection.confirmTransaction(signature, 'confirmed')
    console.log(`Signature: ${signature}`)
    alert(`Payment of ${paymentAmount} SOL sent successfully! Transaction: ${signature}`)

    // Switch to loading state
    loading.value = true

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

async function verifyPaymentOnBackend(signature) {
  try {
    const payload = {
      senderWallet: publicWalletAddress.value,
      expectedAmount: 0.3,
      transactionHash: signature,
    }
    console.log("Payload being sent to the server:", payload)
    const response = await fetch('http://localhost:8080/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    })
    if (!response.ok) {
      const errData = await response.json()
      throw new Error(errData.error || 'Verification failed')
    }
    const data = await response.json()
    console.log("Payment verified successfully! Session data:", data)
    data.paid = true
    localStorage.setItem('sessionData', JSON.stringify(data))
    await play()
  } catch (error) {
    console.error('Backend verification failed:', error)
    alert('Payment verification failed on the server.')
  }
}

async function play() {
  try {
    await useRoom()
    gameStore.connect = true
    router.push('/GamePage')
  } catch (e) {
    console.log(e)
  }
}
</script>
