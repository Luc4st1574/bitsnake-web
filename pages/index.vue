<script setup>
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const router = useRouter()

onMounted(() => {
  router.replace('/home') // Redirects to /home on load
})
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-light text-dark">
    <p class="text-xl font-semibold">Redirecting to Home...</p>
  </div>
</template>
