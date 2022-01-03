<template>
  <div class="bufficorn-container">
    <div class="small-title item user">
      <p class="bufficorn-name">{{ name }}</p>
    </div>
    <img class="bufficorn-image" src="@/assets/bufficorn.svg" alt="Bufficorn">
    <p class="small-title item score">{{ score }}</p>
    <input v-if="select" type="radio" v-model="player.selectedBufficornIndex" :value="index" />
  </div>
</template>

<script>
import { useStore } from '@/stores/player'
export default {
  props: {
    index: Number,
    name: String,
    score: Number,
    select: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const player = useStore()
    return { player }
  }
}
</script>

<style scoped lang="scss">
.bufficorn-container {
  display: grid;
  grid-template-columns: max-content 1fr 80px max-content;
  justify-items: flex-start;
  grid-template-rows: max-content;
  align-items: center;
  .bufficorn-name {
    color: $brown;
  }
  .item {
    padding: 8px;
    text-align: center;
  }
  .score {
    width: 80px;
    word-break: break-all;
  }
  .bufficorn-image {
    justify-self: center;
    height: auto;
    width: 80px;
  }
}
</style>