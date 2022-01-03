<template>
  <div
    :style="{ backgroundImage: `url(${backgroundImage})` }"
    class="background"
    :class="{ ['no-background']: !isBackground }"
  >
    <div class="layout">
      <slot />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue-demi'
import backgroundImage from '../assets/bufficorns-background.png'
export default defineComponent({
  props: {
    isBackground: {
      type: Boolean,
      default: false
    }
  },
  setup (props, ctx) {
    return { backgroundImage }
  }
})
</script>

<style scoped lang="scss">
.background {
  background-position: center;
  background-attachment: fixed;
  background-size: cover;
  background-repeat: no-repeat;
}
.no-background {
  background-image: none !important;
}
.layout {
  width: 100%;
  max-width: 700px;
  min-height: 100vh;
  margin-top: 32px;
  margin: 0 auto;
  display: grid;
  align-items: flex-start;
  padding: 32px;
}
</style>
