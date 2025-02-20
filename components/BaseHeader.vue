<script setup>
import { UserIcon } from 'vue-tabler-icons'
import BaseButton from './BaseButton.vue'
</script>

<template>
  <header>
    <div class="mx-auto flex max-w-screen-xl flex-wrap items-center justify-center px-4">
      <!-- Navigation -->
      <nav class="flex h-24 grow basis-full items-center justify-center space-x-8 text-sm font-medium md:basis-0 md:justify-start">
        <a class="text-gray-900 hover:text-primary" href="#">About</a>
        <a class="text-gray-900 hover:text-primary" href="#">News</a>
        <a class="text-gray-900 hover:text-primary" href="#">Community</a>
      </nav>

      <!-- Buttons -->
      <div class="flex space-x-4 md:mt-0">
        <BaseButton>
          <UserIcon size="21" class="md:mr-1" />
          <span class="hidden md:block">Sign In</span>
        </BaseButton>

        <BaseButton>Try it Free</BaseButton>
      </div>
    </div>
  </header>
</template>
