<template>
  <div class="stat-container" v-for="resource in stats" :key="resource.key">
    <img class="icon" :src="getAssetPath(resource.key)" alt="icon" />
    <div
      class="stat"
      :style="{
        backgroundImage: `linear-gradient(90deg, #bd390075 0%, transparent ${data[
          resource.key
        ] * 100}%)`
      }"
    >
      <p class="key">{{ resource.key.toUpperCase() }}</p>
      <p class="score">{{ resource.score }}</p>
    </div>
  </div>
</template>

<script>
import { useStore } from '@/stores/player'
import { getStatsFromAttributes, getAssetPath } from '@/utils.js'
import { ref } from 'vue'

export default {
  props: {
    data: {
      vigor: Number,
      stamina: Number,
      speed: Number,
      coat: Number,
      agility: Number,
      coolness: Number
    },
    attributes: {
      vigor: Number,
      stamina: Number,
      speed: Number,
      coat: Number,
      agility: Number,
      coolness: Number
    }
  },
  setup (props) {
    const player = useStore()
    const stats = ref(getStatsFromAttributes(props.attributes))
    return { player, stats, getAssetPath }
  }
}
</script>

<style scoped lang="scss">
.stat-container {
  display: grid;
  grid-template-columns: max-content 1fr;
  grid-template-rows: max-content;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
  .stat {
    height: max-content;
    align-items: center;
    padding: 0 4px;
    display: grid;
    grid-gap: 2px;
    width: 120px;
    grid-template-columns: max-content 1fr;
    border-radius: 4px;
    font-size: 10px;
    border: 0.5px solid $black;
    .score {
      justify-self: flex-end;
    }
  }
  .icon {
    width: 16px;
    margin-right: 4px;
    max-height: 16px;
  }
}
</style>
