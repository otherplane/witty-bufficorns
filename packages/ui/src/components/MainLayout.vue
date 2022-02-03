<template>
  <div class="background" :class="RANCHES[player?.theme]">
    <WitnetStrip class="witnet-logo-strip" />
    <div v-if="isBackground" class="main-background" />
    <svgImage v-if="isBufficorn" class="bufficorn-img" :svg="wittyCorn" />
    <div class="layout" :class="{ padding }">
      <slot />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue-demi'
import { useStore } from '@/stores/player'
import wittyCorn from '@/assets/wittyCorn.svg?raw'
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
    },
    padding: {
      type: Boolean,
      default: true
    }
  },
  setup (props, ctx) {
    const player = useStore()
    return {
      player,
      wittyCorn,
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
.witnet-logo-strip {
  position: relative;
  z-index: 12;
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
  right: 24vw;
  position: fixed;
  bottom: 0;
}
.main-background {
  position: fixed;
  height: 100vh;
  width: 100vw;
  bottom: 0px;
  z-index: 4;
  background-position: bottom center;
  background-size: cover;
  background-image: url('../assets/background.png');
}
.layout {
  position: relative;
  z-index: 7;
  width: 100%;
  max-width: 700px;
  min-height: 90vh;
  margin-top: 32px;
  margin: 0 auto;
  display: grid;
  align-items: flex-start;

  &.padding {
    padding: 16px;
  }
}
@media (max-width: 600px) {
  .bufficorn-img {
    height: 50vh;
    right: -30px;
    position: fixed;
    bottom: 0;
  }
}
</style>
