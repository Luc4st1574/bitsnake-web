<template>
  <div class="animate-fade-in animate-duration-3000 mb-4 flex flex-col text-center">
    <span class="logo-color font-readex-pro text-7xl font-semibold tracking-tight antialiased outline-4 md:text-8xl">
      bitsnake
    </span>
    <span class="-mt-2 text-right text-sm text-primary">ALPHA</span>
  </div>
</template>

<style scoped>
.logo-color {
  background: linear-gradient(45deg, #d246e5, #4f46e5, #9333ea);
  background-size: 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
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
