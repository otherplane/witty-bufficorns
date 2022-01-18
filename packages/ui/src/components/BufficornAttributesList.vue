<template>
  <div class="stat-container" v-for="resource in stats" :key="resource.key">
    <img class="icon" :src="getAssetPath(resource.key)" alt="icon" />
    <div class="stat">
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
    attributes: {
      vigor: Number,
      speed: Number,
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
  align-items: center;
  justify-content: center;
  .stat {
    height: max-content;
    align-items: center;
    padding: 0 4px;
    display: grid;
    grid-gap: 8px;
    width: 120px;
    background: linear-gradient(90deg, $opacity-brown 0%, $transparent 60%);
    grid-template-columns: max-content 1fr;
    border-radius: 4px;
    font-size: 12px;
    border: 0.5px solid $black;
    .score {
      justify-self: flex-end;
    }
  }
  .icon {
    width: 30px;
    margin-right: 8px;
    max-height: 30px;
  }
}
</style>
