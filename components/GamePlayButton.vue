<script setup>
defineEmits(['click'])
</script>

<template>
  <button
    @click="$emit('click')" 
    class="group relative inline-flex items-center justify-center overflow-hidden rounded-xl border-4 border-black bg-purple-600 px-8 py-3 text-xl font-bold text-white shadow-[0_4px_0_0_#000] hover:translate-y-0.5 hover:shadow-[0_2px_0_0_#000] outline-none transition-all"
  >
    <slot />
  </button>
</template>
