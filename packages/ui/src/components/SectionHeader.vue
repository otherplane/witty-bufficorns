<template>
  <div class="header">
    <router-link to="/">
      <div class="back-container">
        <img class="angle" src="@/assets/angle-left.svg" alt="angle-left" />
        <p>BACK</p>
      </div>
    </router-link>
    <router-link to="/">
      <img
        class="ranch-img"
        :src="ranchImage(player.ranch.name)"
        alt="Back button"
      />
    </router-link>
    <h3 class="title-section">{{ title }}</h3>
  </div>
</template>

<script>
import { ranchImage } from '@/composables/importRanchImage.js'
import { useStore } from '@/stores/player'
export default {
  props: {
    title: {
      type: String,
      required: true
    }
  },
  setup () {
    const player = useStore()
    return { ranchImage, player }
  }
}
</script>

<style scoped lang="scss">
.header {
  display: grid;
  justify-items: center;
  grid-template-rows: max-content 1fr;
  align-items: center;
  column-gap: 24px;
  .back-container {
    position: absolute;
    display: flex;
    top: 16px;
    left: 16px;
    font-weight: 600;
    color: $brown;
  }
  .angle {
    margin-right: 8px;
  }
  .ranch-img {
    width: 138px;
    height: 100px;
    margin-bottom: 8px;
  }
  .title-section {
    font-family: Road Store;
    font-size: 24px;
    font-weight: bold;
    color: $brown;
  }
}
</style>
