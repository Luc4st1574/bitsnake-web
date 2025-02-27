<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRouter } from 'vue-router'
import { joinRoom, socket, reconnectRoom } from '@/game/socketClient'
import { useGameStore } from '@/stores/game'

const router = useRouter()
const gameStore = useGameStore()

const loadingMessage = ref("Waiting for other players to join...")
const currentPlayers = ref(0)
const minPlayers = computed(() => (gameStore.sessionData && gameStore.sessionData.paid) ? 5 : 1)

// Handler for when the server signals the room is ready
const handleRoomReady = (data) => {
  console.log("Received room_ready event:", data)
  router.push('/GamePage')
}

// Handler for status updates from the server (like player count)
const handleStatusUpdate = (data) => {
  console.log("Received update_status event:", data)
  loadingMessage.value = data.message
  if (data.playersCount !== undefined) {
    currentPlayers.value = data.playersCount
  }
}

onMounted(() => {
  // Attempt to reconnect first; if that fails, join a new room.
  let room = reconnectRoom()
  if (!room) {
    const sessionDataStr = localStorage.getItem('sessionData')
    if (!sessionDataStr) {
      router.push('/')
      return
    }
    const sessionData = JSON.parse(sessionDataStr)
    const userId = sessionData.userID
    // Here we use a placeholder room ID "randomRoomId"—replace with your room logic as needed.
    room = joinRoom('randomRoomId', sessionData.paid ? 'paid' : 'free', userId)
  }

  if (socket) {
    socket.on('room_ready', handleRoomReady)
    socket.on('update_status', handleStatusUpdate)
  }
})

onBeforeUnmount(() => {
  if (socket) {
    socket.off('room_ready', handleRoomReady)
    socket.off('update_status', handleStatusUpdate)
  }
})
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen bg-light text-dark">
    <h1 class="text-3xl font-bold mb-4">Waiting Room</h1>
    <p class="text-lg">{{ loadingMessage }}</p>
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
