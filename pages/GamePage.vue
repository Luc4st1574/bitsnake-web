<!-- pages/GamePage.vue -->
<template>
  <div class="relative select-none">
    <!-- Loading screen until the game start event -->
    <LoadingPage v-if="!gameStarted" ref="loadingPage" />
    <!-- PixiJS game container (shown when game has started) -->
    <div v-else id="game-container" class="absolute inset-0"></div>

    <!-- UI Overlays -->
    <GameStageLabel v-if="gameStore.player.alive" />
    <GameMinimap v-if="gameStore.player.alive" />
    <GameScores v-if="gameStore.player.alive" />
    <GameScoresEarn v-if="gameStore.player.alive" />
    <GameStats v-if="gameStore.player.alive" />
    <GameOver v-if="gameStarted && !gameStore.player.alive" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from '#app'
import LoadingPage from '@/components/LoadingPage.vue'
import GameStageLabel from '@/components/GameStageLabel.vue'
import GameMinimap from '@/components/GameMinimap.vue'
import GameScores from '@/components/GameScores.vue'
import GameScoresEarn from '@/components/GameScoresEarn.vue'
import GameStats from '@/components/GameStats.vue'
import GameOver from '@/components/GameOver.vue'
import { useGameStore } from '@/stores/game'
import { useSketch } from '../game/Sketch'
import { useRoom, exitRoom } from '../game/Client'

const router = useRouter()
const gameStarted = ref(false)
const loadingPage = ref(null)
const pixiInstance = ref(null)
const gameStore = useGameStore()

// Ensure session data exists; otherwise, redirect to PaymentPage
onMounted(() => {
  const sessionData = localStorage.getItem('sessionData')
  if (!sessionData) {
    router.push('/')
  }
})

onMounted(async () => {
  try {
    const room = await useRoom()
    // Listen for the "game-start" event from the backend via Nitro WS
    room.onEvent('game-start', (payload) => {
      console.log('Game start event received:', payload)
      gameStarted.value = true
      // Optionally update loading component with the players list
      if (loadingPage.value && loadingPage.value.updatePlayers) {
        loadingPage.value.updatePlayers(payload.players || [])
      }
      // Initialize PixiJS after game start
      const sketch = useSketch(room)
      pixiInstance.value = sketch()
      const container = document.getElementById('game-container')
      if (container && pixiInstance.value) {
        container.appendChild(pixiInstance.value.view)
      }
    })
  } catch (e) {
    console.error(e)
    router.push('/')
  }
})

onBeforeUnmount(() => {
  exitRoom()
  gameStore.$reset()
  if (pixiInstance.value) {
    pixiInstance.value.destroy(true)
    pixiInstance.value = null
  }
})
</script>
