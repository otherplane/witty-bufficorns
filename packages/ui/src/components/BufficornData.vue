<template>
  <div class="bufficorn-container">
    <div class="stats">
      <div class="stat-container" v-for="resource in stats" :key="resource.key">
        <img class="icon" :src="imgUrl(resource.key)" alt="icon" />
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
    <input
      class="select"
      v-if="select"
      type="radio"
      v-model="player.selectedBufficornIndex"
      :value="index"
    />
  </div>
</template>

<script>
import { useStore } from '@/stores/player'
import { ref, computed } from 'vue'

export default {
  props: {
    index: Number,
    name: String,
    vigor: Number,
    speed: Number,
    agility: Number,
    coolness: Number,
    select: {
      type: Boolean,
      default: false
    }
  },
  setup (props) {
    const player = useStore()
    const stats = ref([
      {
        key: 'vigor',
        score: props.vigor
      },
      {
        key: 'speed',
        score: props.speed
      },
      {
        key: 'agility',
        score: props.agility
      },
      {
        key: 'coolness',
        score: props.coolness
      }
    ])
    const imgUrl = name => {
      return `../src/assets/${name}.svg`
    }
    return { player, stats, imgUrl }
  }
}
</script>

<style scoped lang="scss">
.bufficorn-container {
  display: grid;
  column-gap: 16px;
  grid-template-columns: 1fr 1fr max-content;
  justify-items: center;
  grid-template-rows: max-content 1fr;
  align-items: center;
  .bufficorn-name {
    color: $brown;
  }
  .item {
    padding: 8px;
    text-align: center;
  }
  .stat-container {
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
    grid-column: 1;
    height: auto;
    width: 80px;
  }
}
</style>
