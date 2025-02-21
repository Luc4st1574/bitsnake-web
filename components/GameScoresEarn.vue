<script setup>
import { useGameStore } from '../stores/game'

const { player } = useGameStore()
</script>

<template>
  <div class="fixed top-4 right-6 z-20 select-none">
    <div class="flex justify-center gap-8">
      <div class="flex flex-col items-center">
        <span class="text-4xl font-bold text-white">${{ player.earn }}</span>
        <span class="font-bold text-green-400">+USDT</span>
      </div>

      <div class="flex flex-col items-center">
        <span class="text-4xl font-bold text-white">{{ player.kills }}</span>
        <span class="font-bold text-white">Kills</span>
      </div>
    </div>
  </div>
</template>
