<script setup>
defineProps({
  name: { type: String, default: null },
  placeholder: { type: String, default: 'Nickname' },
  type: { type: String, default: 'text' },
});
</script>

<template>
  <div class="relative">
    <label v-if="name" class="sr-only" :for="name">
      {{ name }}
    </label>

    <input
      :id="name"
      :name="name"
      :type="type"
      :placeholder="placeholder"
      autocomplete="off"
      class="w-full rounded-xl border-4 border-black p-3 pr-12 font-bold focus:border-primary focus:outline-none"
    />

    <span class="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-gray-500">
      <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
        />
      </svg>
    </span>
  </div>
</template>
