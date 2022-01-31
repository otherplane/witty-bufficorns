<template>
  <div class="card-container" :class="{ horizontal }">
    <div
      class="card"
      @click="showStats = !showStats"
      :class="{ flipped: showStats }"
    >
      <div
        class="face front"
        :class="{ horizontal, background: backgroundFront, selected }"
      >
        <BufficornImage :class="{ selected }" :name="name" />
        <PolarChart v-if="normalizedData" :stats="normalizedData" />
      </div>
      <div
        class="face back"
        :class="{ horizontal, background: backgroundBack }"
      >
        <BufficornImage :name="name" />
        <div class="attributes" :class="{ horizontal }">
          <BufficornAttributesList
            :attributes="attributes"
            :data="normalizedData"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from '@/stores/player'
import { ref, computed, onBeforeMount } from 'vue'
import { normalizedChartData } from '../utils'

export default {
  props: {
    index: Number,
    attributes: {
      coat: Number,
      coolness: Number,
      intelligence: Number,
      speed: Number,
      stamina: Number,
      vigor: Number
    },
    selected: {
      type: Boolean,
      default: false
    },
    name: String,
    horizontal: {
      type: Boolean,
      default: false
    },
    backgroundFront: {
      type: Boolean,
      default: false
    },
    backgroundBack: {
      type: Boolean,
      default: false
    }
  },
  setup (props) {
    const player = useStore()
    const showStats = ref(false)
    const normalizedData = computed(() =>
      normalizedChartData(props.attributes, player.bufficornsGlobalStats)
    )
    return { player, showStats, normalizedData }
  }
}
</script>

<style scoped lang="scss">
.card-container {
  width: 160px;
  height: 300px;
  perspective: 600px;
  &.horizontal {
    height: 160px;
    width: 300px;
  }
}

.card {
  width: 100%;
  height: 100%;
  transition: transform 1s;
  transform-style: preserve-3d;
  cursor: pointer;
  position: relative;
}

.card.flipped {
  transform: rotateY(180deg);
}

.face {
  position: absolute;
  border-radius: 4px;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  display: grid;
  justify-content: center;
  row-gap: 16px;
  grid-template-rows: repeat(2, max-content);
  justify-items: center;
  align-content: center;
  color: var(--primary-color);
  background-color: $white;
  &.selected {
    border: 2px solid var(--primary-color);
  }
  &.horizontal {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: 1fr;
    justify-items: center;
    align-items: center;
  }
}

.background {
  background-color: var(--primary-color-opacity-2);
  border-radius: 4px;
}

.back {
  transform: rotateY(180deg);
  .attributes {
    grid-row: 2;
    &.horizontal {
      grid-row: 1;
    }
  }
}
</style>
