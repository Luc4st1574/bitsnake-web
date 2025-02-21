<script setup>
import { useGameStore } from '../stores/game'

const { player } = useGameStore()
</script>

<template>
  <div class="absolute top-12 left-5 select-none">
    <div class="relative flex space-x-3">
      <span class="text-sm font-bold text-white/50">
        FPS {{ player.fps }}
      </span>
      <span class="text-sm font-bold text-white/50">
        {{ player.ping }} ms
      </span>
    </div>
  </div>
</template>
