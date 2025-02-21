<script setup>
import router from '@/router'
import { useGameStore } from '../stores/game'
import DieButton from './DieButton.vue'
import { leaveRoom } from '../game/Client'

const gameStore = useGameStore()
const player = gameStore.player

function gameOver() {
  leaveRoom(gameStore)
  router.push('/')
}
</script>

<template>
  <div class="absolute flex h-screen w-screen select-none items-center justify-center bg-black/10 animate-fade-in animate-duration-2000">
    <div class="flex h-full w-full flex-col items-center justify-between bg-black/10">
      <div></div>

      <div class="text-center">
        <h1 class="mb-5 font-readex-pro text-7xl font-bold text-danger drop-shadow-xl">
          Game Over
        </h1>

        <div class="flex justify-center">
          <DieButton @click="gameOver">Continue</DieButton>
        </div>
      </div>

      <div class="mb-10 flex justify-center gap-8">
        <div class="flex flex-col items-center">
          <span class="text-4xl font-bold text-white">${{ player.earn }}</span>
          <span class="font-bold text-green-400">+USDT</span>
        </div>

        <div class="flex flex-col items-center">
          <span class="text-4xl font-bold text-white">{{ player.rank }}</span>
          <span class="font-bold text-yellow-400">Rank</span>
        </div>

        <div class="flex flex-col items-center">
          <span class="text-4xl font-bold text-white">{{ player.kills }}</span>
          <span class="font-bold text-white">Kills</span>
        </div>
      </div>
    </div>
  </div>
</template>
