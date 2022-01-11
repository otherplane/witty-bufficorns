<template>
  <BufficornData
    v-for="(bufficorn, index) in bufficornsData"
    :index="index"
    :key="bufficorn.name"
    :name="bufficorn.name"
    :vigor="bufficorn.vigor"
    :agility="bufficorn.agility"
    :speed="bufficorn.speed"
    :coolness="bufficorn.coolness"
    :select="select"
  />
</template>

<script>
import { useStore } from '@/stores/player'
export default {
  props: {
    select: {
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
