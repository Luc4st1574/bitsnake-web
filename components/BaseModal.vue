<script setup>
import { ref, watchEffect, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  show: { type: Boolean, required: true }, // Controls visibility
  title: { type: String, default: 'Modal Title' },
  closeOnClickOutside: { type: Boolean, default: true }, // Close when clicking outside
})

const emit = defineEmits(['close'])

const modalRef = ref(null)

const closeModal = () => {
  emit('close')
}

const handleClickOutside = (event) => {
  if (modalRef.value && !modalRef.value.contains(event.target)) {
    closeModal()
  }
}

watchEffect(() => {
  if (props.show) {
    document.body.classList.add('overflow-hidden')
  } else {
    document.body.classList.remove('overflow-hidden')
  }
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.body.classList.remove('overflow-hidden')
})
</script>

<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="show"
        class="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md p-4 z-50"
      >
        <div
          ref="modalRef"
          class="relative w-full max-w-lg rounded-lg bg-white shadow-lg p-6"
        >
          <!-- Close Button -->
          <button
            class="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            @click="closeModal"
          >
            ✕
          </button>

          <!-- Modal Title -->
          <h3 class="text-xl font-bold text-gray-900 mb-4">{{ title }}</h3>

          <!-- Modal Content -->
          <slot />

          <!-- Footer Buttons -->
          <div class="mt-4 flex justify-end space-x-2">
            <button class="px-4 py-2 bg-gray-300 rounded-md" @click="closeModal">
              Cancel
            </button>
            <button class="px-4 py-2 bg-primary text-white rounded-md">
              Confirm
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style>
/* Fade transition for smooth modal opening */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
