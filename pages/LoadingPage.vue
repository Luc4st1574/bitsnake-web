<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useRoom, socket } from '@/game/Client'
import { useGameStore } from '@/stores/game'

// Reactive references for UI
const loadingMessage = ref("Waiting for other players to join...")
const currentPlayers = ref(0) // track current player count
const minPlayers = ref(1)     // free mode typically requires 1 player

// Access Nuxt's router & the Pinia game store
const router = useRouter()
const gameStore = useGameStore()

// Attempt to load session data from localStorage if not already in the store
if (!gameStore.sessionData) {
  const stored = localStorage.getItem('sessionData')
  if (stored) {
    gameStore.setSessionData(JSON.parse(stored))
  }
}

// Handle incoming WebSocket messages
const handleMessage = (event) => {
  try {
    const data = JSON.parse(event.data)
    console.log("Message from server:", data)

    // If the server says "room_ready", transition to the GamePage
    if (data.action === "room_ready") {
      router.push('/GamePage')
    }
    // If the server updates player count
    else if (data.action === "update_status") {
      if (data.playersCount !== undefined) {
        currentPlayers.value = data.playersCount
      }
      loadingMessage.value = data.message || "Waiting for other players to join..."
    }
    // Additional handling for other actions or state patches, if needed
  } catch (e) {
    console.error("Failed to parse WebSocket message:", e)
  }
}

// Lifecycle hooks
onMounted(async () => {
  // Join or reconnect to the room
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

    <!-- A simple spinner for visual feedback -->
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
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
