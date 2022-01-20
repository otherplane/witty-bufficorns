<template>
  <div class="bufficorns-container">
    <BufficornData
      v-for="(bufficorn, index) in bufficornsData"
      :bufficorn-list="bufficornsData"
      :index="index"
      :key="bufficorn.name"
      :name="bufficorn.name"
      :attributes="{
        vigor: bufficorn.vigor,
        agility: bufficorn.agility,
        speed: bufficorn.speed,
        coolness: bufficorn.coolness,
        coat: bufficorn.coat,
        stamina: bufficorn.stamina
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
  grid-template-columns: repeat(2, max-content);
  grid-template-rows: 1fr 1fr;
  justify-content: center;
  grid-gap: 16px;
}
</style>
