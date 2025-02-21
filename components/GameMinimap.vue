<script setup>
import { reactive } from 'vue'
import { useGameStore } from '~/stores/game'
import minimap from '@/assets/img/minimap.png'
import point from '@/assets/img/point.png'

const mapSize = 80
const pointSize = 7
const offset = pointSize / 2

const snakeStyle = reactive({
  left: null,
  top: null
})

const gameStore = useGameStore()

gameStore.$subscribe((_mutation, state) => {
  const factor = mapSize / state.room.worldSize

  snakeStyle.left = `${state.player.x * factor - offset}px`
  snakeStyle.top = `${state.player.y * factor - offset}px`
})
</script>

<template>
  <div class="pointer-events-none fixed bottom-6 right-6 z-20 h-20 w-20 select-none">
    <img
      alt="map"
      class="absolute left-0 top-0 opacity-50"
      :src="minimap"
    />
    <img
      alt="snake"
      class="absolute"
      :src="point"
      :style="snakeStyle"
    />
  </div>
</template>
