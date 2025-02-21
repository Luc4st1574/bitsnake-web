<script setup>
import { useGameStore } from '../stores/game'

const { player } = useGameStore()
</script>

<template>
  <div class="fixed bottom-8 left-8 z-20 select-none">
    <div class="flex justify-center gap-8">
      <div class="flex flex-col items-center">
        <span class="text-3xl font-bold text-white">{{ player.rank }}</span>
        <span class="font-bold text-yellow-400">Rank</span>
      </div>

      <div class="flex flex-col items-center">
        <span class="text-3xl font-bold text-white">{{ player.score }}</span>
        <span class="font-bold text-white">Score</span>
      </div>
    </div>
  </div>
</template>
