<script setup>
defineProps({
  dynamic: { type: Boolean, default: false },
});
</script>

<template>
  <button
    class="group relative inline-flex items-center justify-center overflow-hidden rounded-xl border-4 border-black bg-purple-600 px-8 py-3 text-xl font-bold text-white shadow-[0_4px_0_0_#000] hover:translate-y-0.5 hover:shadow-[0_2px_0_0_#000] outline-none"
  >
    <template v-if="dynamic">
      <span
        class="absolute left-0 -translate-x-full transition-transform group-hover:translate-x-4"
      >
        <slot name="icon" />
      </span>

      <span class="transition-all group-hover:ml-4">
        <slot />
      </span>
    </template>

    <template v-else>
      <slot />
    </template>
  </button>
</template>
