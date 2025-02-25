<script setup>
import { ref } from 'vue'

const players = ref([])

function updatePlayers(newPlayers) {
  players.value = newPlayers
}

defineExpose({ updatePlayers })
</script>


<!-- components/LoadingPage.vue -->
<template>
    <div class="loading-page flex flex-col items-center justify-center min-h-screen bg-light text-dark">
      <div class="spinner"></div>
      <p class="text-xl font-semibold mt-4">Waiting for players to join...</p>
      <div class="players-list mt-4">
        <ul>
          <li v-for="player in players" :key="player.id">
            {{ player.name }}
          </li>
        </ul>
      </div>
    </div>
  </template>

  <style scoped>
    .spinner {
    border: 8px solid #f3f3f3;
    border-top: 8px solid #3498db;
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
  