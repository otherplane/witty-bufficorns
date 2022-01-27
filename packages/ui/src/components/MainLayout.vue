<template>
  <div class="background" :class="RANCHES[player?.ranch?.name]">
    <div v-if="isBackground" class="grain-background"></div>
    <svgImage v-if="isBufficorn" class="bufficorn-img" :svg="bufficornMain" />
    <div class="layout">
      <slot />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue-demi'
import { useStore } from '@/stores/player'
import bufficornMain from '@/assets/bufficorn-main.svg?raw'
import { RANCHES } from '../constants'

export default defineComponent({
  props: {
    isBackground: {
      type: Boolean,
      default: false
    },
    isBufficorn: {
      type: Boolean,
      default: false
    }
  },
  setup (props, ctx) {
    const player = useStore()
    return {
      player,
      bufficornMain,
      RANCHES
    }
  }
})
</script>

<style scoped lang="scss">
.background {
  height: 100%;
  position: relative;
  left: 0;
  right: 0;
  z-index: 3;
  background-color: $white;
  background: $white;
}
.mountains-img {
  width: 100vw;
  position: fixed;
  z-index: 4;
  bottom: 0;
  left: 0;
}
.bufficorn-img {
  height: 50vh;
  z-index: 5;
  left: 40vw;
  position: absolute;
  bottom: 0;
}
.grain-background {
  position: fixed;
  height: 100vh;
  width: 100vw;
  z-index: 4;
  background-position: bottom left;
  background-size: cover;
  background-image: url('../assets/background.svg');
}
.layout {
  position: relative;
  z-index: 7;
  width: 100%;
  max-width: 700px;
  min-height: 100vh;
  margin-top: 32px;
  margin: 0 auto;
  display: grid;
  align-items: flex-start;
  padding: 16px;
}
@media (max-width: 600px) {
  .bufficorn-img {
    height: 50vh;
    left: 10vw;
    position: absolute;
    bottom: 0;
  }
}
</style>
