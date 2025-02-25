<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useNuxtApp, useRouter } from '#app'

import { useGameStore } from '@/stores/game'

import GameMinimap from '../components/GameMinimap.vue'
import GameScores from '../components/GameScores.vue'
import GameScoresEarn from '../components/GameScoresEarn.vue'
import GameStats from '../components/GameStats.vue'
import GameOver from '../components/GameOver.vue'
import GameStageLabel from '../components/GameStageLabel.vue'

import { useSketch } from '../game/Sketch'
import { useRoom, exitRoom } from '../game/Client'

// --- Session Check ---
const sessionData = ref(null)
const router = useRouter()

onMounted(() => {
  // Try to load the session data from localStorage.
  const data = localStorage.getItem('sessionData')
  if (data) {
    sessionData.value = JSON.parse(data)
  } else {
    // If no session data is found, redirect back to the payment page.
    router.push('/')
  }
})

// --- Game Setup ---
const gameStore = useGameStore()
const connected = ref(false)
const pixiInstance = ref(null)

onMounted(async () => {
  try {
    const room = await useRoom()
    // useSketch now returns a function that creates a Pixi.Application
    const sketch = useSketch(room)
    pixiInstance.value = sketch() // Initialize PixiJS application

    // Attach the Pixi canvas to the container element in the template
    const container = document.getElementById('game-container')
    if (container && pixiInstance.value) {
      container.appendChild(pixiInstance.value.view)
    }
    connected.value = true
  } catch (e) {
    console.error(e)
    router.push('/')
  }
})

onBeforeUnmount(() => {
  exitRoom()
  gameStore.$reset()
  if (pixiInstance.value) {
    pixiInstance.value.destroy(true) // Clean up PixiJS properly
    pixiInstance.value = null
  }
})
</script>

<template>
  <div class="relative select-none">
    <!-- PixiJS canvas will be appended here -->
    <div id="game-container" class="absolute inset-0"></div>

    <!-- UI Overlays -->
    <GameStageLabel v-if="gameStore.player.alive" />
    <GameMinimap v-if="gameStore.player.alive" />
    <GameScores v-if="gameStore.player.alive" />
    <GameScoresEarn v-if="gameStore.player.alive" />
    <GameStats v-if="gameStore.player.alive" />

    <GameOver v-if="connected && !gameStore.player.alive" />
  </div>
</template>