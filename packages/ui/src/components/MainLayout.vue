<template>
  <div class="background">
    <div class="grain-background"></div>
    <img class="mountains-img" src="@/assets/mountains.svg" />
    <img
      v-if="isBackground"
      class="bufficorn-img"
      src="@/assets/bufficorn-main.svg"
      alt="bufficorn"
    />
    <img class="mountains-img" src="@/assets/mountains.svg" alt="bufficorn" />
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
    return { backgroundUrl: props.isBackground ? backgroundImage : null }
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
  background-color: $orange;
  background: linear-gradient(0deg, $orange 0%, $beige 90%);
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
  z-index: 6;
  background: url('../assets/grainy-gradient.svg');
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
  padding: 32px;
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
