<script setup>
import { useHead, useRouter } from '#app'
import BaseFooter from '@/components/BaseFooter.vue'
import GamePlayButton from '@/components/GamePlayButton.vue'
import BaseLogo from '@/components/BaseLogo.vue'

const router = useRouter()

// When user clicks "Play", go to PaymentPage (paid mode)
const redirectToPayment = () => {
  // Clear last room info so we do NOT reconnect
  localStorage.removeItem('lastRoomId')
  localStorage.removeItem('lastUserId')

  router.push('/PaymentPage')
}

// When user clicks "Try", create a free session and go directly to LoadingPage
const redirectToPractice = () => {
  // Clear last room info so we do NOT reconnect
  localStorage.removeItem('lastRoomId')
  localStorage.removeItem('lastUserId')

  // Create a dummy free session (free mode)
  const freeSession = {
    paid: false,
    // Generate a pseudo-unique ID (here we use the current timestamp modulo some number)
    userID: (Date.now() % 1000000).toString()
  }
  localStorage.setItem('sessionData', JSON.stringify(freeSession))
  router.push('/LoadingPage')
}
</script>

<template>
  <div class="flex h-screen flex-col justify-between bg-light text-dark relative">
    <!-- Main Content -->
    <div class="flex grow flex-col items-center justify-center">
      <BaseLogo />
      <div class="flex flex-col items-center">
        <GamePlayButton class="mt-4" @click="redirectToPayment">
          Play
        </GamePlayButton>
        <!-- New Try button for practice mode -->
        <GamePlayButton class="mt-2" @click="redirectToPractice">
          Try
        </GamePlayButton>
      </div>
    </div>

    <BaseFooter />
  </div>
</template>
