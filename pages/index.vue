<script setup>
import { useRouter } from 'vue-router'
import BaseFooter from '@/components/BaseFooter.vue'
import GamePlayButton from '@/components/GamePlayButton.vue'
import BaseLogo from '@/components/BaseLogo.vue'

const router = useRouter()

const redirectToPayment = () => {
  router.push('/PaymentPage')
}
</script>

<template>
  <div class="flex h-screen flex-col justify-between bg-light text-dark relative">
    <!-- Main Content -->
    <div class="flex grow flex-col items-center justify-center">
      <BaseLogo />
      <div class="flex flex-col items-center">
        <GamePlayButton class="mt-4" @click="redirectToPayment">
          Play
        </GamePlayButton>
      </div>
    </div>

    <BaseFooter />

    <!-- Animated Background -->
    <div class="absolute -z-50 flex h-screen w-screen overflow-hidden">
      <div class="g-container">
        <div class="g-group">
          <div class="item item-right"></div>
          <div class="item item-left"></div>
          <div class="item item-top"></div>
          <div class="item item-bottom"></div>
          <div class="item item-middle"></div>
        </div>
        <div class="g-group">
          <div class="item item-right"></div>
          <div class="item item-left"></div>
          <div class="item item-top"></div>
          <div class="item item-bottom"></div>
          <div class="item item-middle"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use "sass:math";

// Updated functions using math.div() for division
@function randomNum($max, $min: 0, $u: 1) {
  @return ($min + math.random($max)) * $u;
}

@function randomColor() {
  @return rgb(randomNum(255, 100), randomNum(255, 100), 255);
}

@function shadowSet($maxWidth, $maxHeight, $count) {
  $shadow: 0 0 0 0 randomColor();

  @for $i from 0 through $count {
    // Generate random fractions between 0 and 1 using math.div()
    $randX: math.div(math.random(10000), 10000);
    $randY: math.div(math.random(10000), 10000);
    $x: #{$randX * $maxWidth};
    $y: #{$randY * $maxHeight};

    $shadow: $shadow, #{$x} #{$y} 0 #{math.random(10)}px randomColor();
  }

  @return $shadow;
}

$fov: 5px;

.g-container {
  margin: auto;
  perspective: $fov;
  perspective-origin: 5% 5%;
  position: relative;
  animation: hueRotate 20s infinite linear;
}

.g-group {
  position: absolute;
  width: 100vw;
  height: 100vh;
  left: -50vw;
  top: -50vh;
  transform-style: preserve-3d;
  animation: move 8s infinite linear;
}

.g-group:nth-child(2) {
  animation: move 8s infinite linear;
  animation-delay: -4s;
}

.item {
  position: absolute;
  width: 100%;
  height: 100%;
  // background: linear-gradient(#05040a, #03010e);
  // background-size: cover;
  // opacity: 1;
  animation: fade 8s infinite linear;
  animation-delay: 0;
}

.item::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 20px;
  height: 1px;
  border-radius: 100%;
  box-shadow: shadowSet(100vw, 100vh, 200);
}

.g-group:nth-child(2) .item {
  animation-delay: -4s;
}

$translate: -500px;

.item-right {
  transform: rotateY(90deg) rotateZ(90deg) translateZ($translate);
}

.item-left {
  transform: rotateY(-90deg) rotateZ(90deg) translateZ($translate);
}

.item-top {
  transform: rotateX(90deg) translateZ($translate);
}

.item-bottom {
  transform: rotateX(-90deg) translateZ($translate);
}

.item-middle {
  transform: rotateX(180deg) translateZ($translate * 2);
}

@keyframes move {
  0% {
    transform: translateZ(-200px) rotate(0deg);
  }
  100% {
    transform: translateZ(200px) rotate(0deg);
  }
}

@keyframes fade {
  0% {
    opacity: 0;
  }
  25%,
  60% {
    opacity: 1;
  }
  100% {
    opacity: 0.2;
  }
}

@keyframes hueRotate {
  0% {
    filter: hue-rotate(0);
  }
  100% {
    filter: hue-rotate(10deg);
  }
}
</style>
