<template>
  <div class="bufficorns-container">
    <BufficornData
      v-for="(bufficorn, index) in bufficornsData"
      :bufficorn-list="player.bufficornsGlobalStats"
      :index="index"
      :creationIndex="bufficorn.creationIndex"
      :key="bufficorn.name"
      :name="bufficorn.name"
      :background-front="true"
      :background-back="false"
      :attributes="{
        coat: bufficorn.coat,
        coolness: bufficorn.coolness,
        intelligence: bufficorn.intelligence,
        speed: bufficorn.speed,
        stamina: bufficorn.stamina,
        vigor: bufficorn.vigor
      }"
      :selectable="selectable"
    />
  </div>
</template>

<script>
import { useStore } from '@/stores/player'

export default {
  props: {
    selectable: {
      type: Boolean,
      default: false
    }
  },
  setup () {
    const player = useStore()
    const bufficornsData = player.ranch.bufficorns
    return { bufficornsData, player }
  }
}
</script>

<style lang="scss" scoped>
.bufficorns-container {
  display: grid;
  grid-template-columns: repeat(2, max-content);
  grid-template-rows: 1fr 1fr;
  justify-content: center;
  grid-gap: 16px;
}
@media (max-width: 330px) {
  .bufficorns-container {
    grid-template-columns: 1fr;
  }
}
</style>
