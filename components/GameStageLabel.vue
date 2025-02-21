<script setup>
import { useGameStore } from '../stores/game'

const { room } = useGameStore()
</script>

<template>
  <div class="fixed top-3 left-5 z-20 select-none">
    <div class="flex justify-center gap-8">
      <div class="flex flex-col">
        <span class="text-3xl font-bold uppercase text-white">
          {{ room.stageName }}

          <span v-if="room.stageName === 'Lobby'">
            <span class="text-white/50">{{ room.playersCount }}</span>
            <span>/</span>
            <span>{{ room.maxPlayers }}</span>
          </span>
        </span>
      </div>
    </div>
  </div>
</template>
