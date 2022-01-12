<template>
  <div class="stats-container" :class="{ even: index % 2 }">
    <div class="stats">
      <div class="stat-container" v-for="resource in stats" :key="resource.key">
        <img class="icon" :src="getAssetPath(resource.key)" alt="icon" />
        <div class="stat">
          <p class="key">{{ resource.key.toUpperCase() }}</p>
          <p class="score">{{ resource.score }}</p>
        </div>
      </div>
    </div>
    <div class="small-title item user">
      <p class="bufficorn-name">{{ name }}</p>
    </div>
    <img class="bufficorn-image" src="@/assets/bufficorn.svg" alt="Bufficorn" />
  </div>
</template>

<script>
import { useStore } from '@/stores/player'
import { ref } from 'vue'
import { getStatsFromAttributes, getAssetPath } from '@/utils.js'

export default {
  props: {
    index: Number,
    attributes: {
      vigor: Number,
      speed: Number,
      agility: Number,
      coolness: Number
    },
    name: String,
    select: {
      type: Boolean,
      default: false
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
.even {
  background: $opacity-beige;
  border-radius: 4px;
}
.stats-container {
  padding: 16px;
  display: grid;
  column-gap: 16px;
  grid-template-columns: 1fr 1fr;
  justify-items: center;
  grid-template-rows: max-content 1fr;
  align-items: center;
  .bufficorn-name {
    justify-self: flex-start;
    color: $brown;
  }
  .item {
    justify-self: flex-start;
    padding: 8px;
    text-align: center;
  }
  .stat-container {
    justify-self: flex-end;
    display: grid;
    grid-template-columns: max-content 1fr;
    justify-content: center;
    .icon {
      width: 30px;
      margin-right: 8px;
      max-height: 30px;
    }
  }
  .stats {
    justify-self: flex-end;
    display: grid;
    grid-row: 1 / span 2;
    padding: 4px;
    grid-column: 2;
    row-gap: 8px;
    grid-template-rows: repeat(3, auto);
    grid-template-columns: 1fr;
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
  }
  .select {
    grid-row: 1 / span 2;
    grid-column: 3;
  }
  .bufficorn-image {
    justify-self: flex-start;
    grid-column: 1;
    height: auto;
    width: 80px;
  }
}
</style>
