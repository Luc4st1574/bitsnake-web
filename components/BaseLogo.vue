<template>
  <div class="animate-fade-in animate-duration-3000 mb-4 flex flex-col text-center">
    <span class="logo-color bg-clip-text font-readex-pro text-7xl font-semibold tracking-tight text-transparent antialiased outline-4 md:text-8xl">
      bitsnake
    </span>
    <span class="-mt-2 text-right text-sm text-primary">ALPHA</span>
  </div>
</template>

<style scoped>
.logo-color {
  /* Use a linear gradient as the background */
  background: linear-gradient(45deg, #d246e5, #4f46e5, #9333ea);
  background-size: 300%;
  /* Animate the gradient by moving its position */
  animation: flow 5s linear infinite alternate;
}

@keyframes flow {
  0% {
    background-position: 0%;
  }
  100% {
    background-position: 100%;
  }
}
</style>
