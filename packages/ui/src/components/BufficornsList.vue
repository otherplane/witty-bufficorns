<template>
  <div class="bufficorns-container">
    <BufficornData
      v-for="(bufficorn, index) in bufficornsData"
      :index="index"
      :key="bufficorn.name"
      :name="bufficorn.name"
      :attributes="{
        vigor: bufficorn.vigor,
        agility: bufficorn.agility,
        speed: bufficorn.speed,
        coolness: bufficorn.coolness
      }"
      :selectable="selectable"
    />
  </div>
</template>

<script>
import { useStore } from '@/stores/player'
import { onMounted } from 'vue'

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
    return { bufficornsData }
  }
}
</script>

<style lang="scss" scoped>
.bufficorns-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-gap: 40px;
}
@media (max-width: 600px) {
  .bufficorns-container {
    grid-template-columns: 1fr;
  }
}
</style>
