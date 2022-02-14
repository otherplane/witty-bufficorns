<template>
  <div class="stat-container" v-for="resource in stats" :key="resource.key">
    <img class="icon" :src="importSvg(resource.key)" alt="icon" />
    <div class="stat" :style="createResourceGradient(resource)">
      <p class="key">{{ resource.label.toUpperCase() }}</p>
      <p class="score">{{ formatNumber(resource.score) }}</p>
    </div>
  </div>
</template>

<script>
import { useStore } from '@/stores/player'
import { getStatsFromAttributes, formatNumber } from '@/utils.js'
import { importSvg } from '@/composables/importSvg.js'
import { computed } from 'vue'
import { ATTRIBUTES } from '@/constants.js'

export default {
  props: {
    data: {
      coat: Number,
      coolness: Number,
      intelligence: Number,
      speed: Number,
      stamina: Number,
      vigor: Number
    },
    attributes: {
      coat: Number,
      coolness: Number,
      intelligence: Number,
      speed: Number,
      stamina: Number,
      vigor: Number
    }
  },
  setup (props) {
    const player = useStore()
    const stats = computed(() => getStatsFromAttributes(props.attributes))
    function createResourceGradient (resource) {
      const resourcePercentage = props.data[resource.key] * 100
      return {
        backgroundImage: `linear-gradient(90deg, ${
          ATTRIBUTES[resource.key].color
        }75 0%, #f0f0f0 ${resourcePercentage}%)`
      }
    }
    return { player, stats, createResourceGradient, importSvg, formatNumber }
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
  color: $black;
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
