<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRoom, socket } from '@/game/Client'  // adjust path as needed
import { useGameStore } from '@/stores/game'

const router = useRouter()
const gameStore = useGameStore()

// Load session data from localStorage if not already in the store.
if (!gameStore.sessionData) {
  const stored = localStorage.getItem('sessionData')
  if (stored) {
    gameStore.setSessionData(JSON.parse(stored))
  }
}

const loadingMessage = ref("Waiting for other players to join...")

// currentPlayers from the game store (defaulting to 0 if not set)
const currentPlayers = computed(() => gameStore.room.playersCount || 0)

// Compute the minimum number of players based on session data.
// For paid matches, the backend requires 5 players; for free matches, only 1.
const minPlayers = computed(() => {
  return gameStore.sessionData && gameStore.sessionData.paid ? 5 : 1
})

const handleMessage = (event) => {
  try {
    const data = JSON.parse(event.data)
    if (data.action === "room_ready") {
      // When the server signals that the room is ready, navigate to GamePage.
      router.push('/GamePage')
    } else if (data.action === "update_status") {
      loadingMessage.value = data.message
      if (data.playersCount !== undefined) {
        gameStore.room.playersCount = data.playersCount
      }
    }
  } catch (e) {
    console.error("Failed to parse WebSocket message:", e)
  }
}

onMounted(async () => {
  // Ensure sessionData is loaded (if not already done above)
  if (!gameStore.sessionData) {
    const stored = localStorage.getItem('sessionData')
    if (stored) {
      gameStore.setSessionData(JSON.parse(stored))
    }
  }
  // Initialize the room connection.
  await useRoom()
  socket.addEventListener('message', handleMessage)
})

onBeforeUnmount(() => {
  socket.removeEventListener('message', handleMessage)
})
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen bg-light text-dark">
    <h1 class="text-3xl font-bold mb-4">Waiting Room</h1>
    <p class="text-lg">{{ loadingMessage }}</p>
    <!-- Show current players vs. minimum required -->
    <p class="text-lg">
      Players in match: {{ currentPlayers }} / {{ minPlayers }} required to start
    </p>
    <div class="spinner mt-8"></div>
  </div>
</template>

<style scoped>
.spinner {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #9333ea;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 2s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
