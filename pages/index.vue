<script setup>
import { useRouter } from 'vue-router'
import BaseFooter from '@/components/BaseFooter.vue'
import GamePlayButton from '@/components/GamePlayButton.vue'
import BaseLogo from '@/components/BaseLogo.vue'

const router = useRouter()

const redirectToPayment = () => {
  router.push('/PaymentPage')
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
      </div>
    </div>

    <BaseFooter />
  </div>
</template>