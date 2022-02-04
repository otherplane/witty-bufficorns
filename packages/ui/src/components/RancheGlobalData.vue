<template>
  <div class="stats-container">
    <p class="position">{{ position }}</p>
    <img
      class="bufficorn-image"
      :src="importSvg(RANCHES[name])"
      alt="Bufficorn"
    />
    <p class="score">{{ score }}</p>
  </div>
</template>

<script>
import { importSvg } from '@/composables/importSvg.js'
import { RANCHES } from '@/constants.js'
export default {
  props: {
    index: Number,
    name: String,
    score: Number,
    position: Number
  },
  setup () {
    return { importSvg, RANCHES }
  }
}
</script>

<style scoped lang="scss">
.stats-container {
  display: grid;
  grid-template-columns: max-content max-content 1fr;
  grid-gap: 16px;
  padding: 16px;
  justify-content: center;
  align-items: center;
  .bufficorn-image {
    width: 100px;
    max-height: 100px;
  }
  .position {
    color: var(--primary-color);
    font-weight: bold;
    justify-self: flex-start;
  }
  .score {
    justify-self: end;
  }
}
</style>
