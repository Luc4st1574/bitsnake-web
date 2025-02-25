<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useRoom, socket } from '@/game/Client'  // adjust the import path as needed
import { useGameStore } from '@/stores/game'

const router = useRouter()
const gameStore = useGameStore()
const loadingMessage = ref("Waiting for other players to join...")

const handleMessage = (event) => {
  try {
    const data = JSON.parse(event.data)
    if (data.action === "room_ready") {
      // Once the room is ready, set the connect flag to true and navigate to GamePage.
      gameStore.connect = true
      router.push('/GamePage')
    } else if (data.action === "update_status") {
      loadingMessage.value = data.message
    }
  } catch (e) {
    console.error("Failed to parse WebSocket message:", e)
  }
}

onMounted(async () => {
  // Initialize the room connection.
  await useRoom()
  // Set the connection flag to true once the socket is open.
  socket.addEventListener('open', () => {
    gameStore.connect = true
  })
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
