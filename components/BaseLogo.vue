<template>
    <div class="animate-fade-in animate-duration-3000 mb-4 flex flex-col text-center">
      <span
        class="logo-color bg-clip-text font-readex-pro text-7xl font-semibold tracking-tight text-transparent antialiased outline-4 md:text-8xl"
      >
        bitsnake
      </span>
      <span class="-mt-2 text-right text-sm text-primary">ALPHA</span>
    </div>
  </template>
  
  <style scoped>
  .logo-color {
    background-size: 300%;
    background-color: #9333ea;
    animation: flow 5s linear alternate infinite;
  }
  
  @keyframes flow {
    0% {
      background-color: #d246e5;
    }
    50% {
      background-color: #4f46e5;
    }
    100% {
      background-color: #9333ea;
    }
  }
  </style>
  