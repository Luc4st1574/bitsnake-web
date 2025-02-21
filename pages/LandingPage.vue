<script setup>
import { useRouter } from 'vue-router'
import BaseFooter from '@/components/BaseFooter.vue'
import GamePlayButton from '@/components/GamePlayButton.vue'
import BaseLogo from '@/components/BaseLogo.vue'

const router = useRouter()

const redirectToPayment = () => {
  router.push('/payment')
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

    <!-- Animated Background -->
    <div class="absolute -z-50 flex h-screen w-screen overflow-hidden">
      <div class="g-container">
        <div class="g-group">
          <div class="item item-right"></div>
          <div class="item item-left"></div>
          <div class="item item-top"></div>
          <div class="item item-bottom"></div>
          <div class="item item-middle"></div>
        </div>
        <div class="g-group">
          <div class="item item-right"></div>
          <div class="item item-left"></div>
          <div class="item item-top"></div>
          <div class="item item-bottom"></div>
          <div class="item item-middle"></div>
        </div>
      </div>
    </div>
  </div>
</template>
