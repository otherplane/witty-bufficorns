<template>
  <BufficornData
    v-for="(bufficorn, index) in bufficornsData"
    :index="index"
    :key="bufficorn.name"
    :name="bufficorn.name"
    :score="bufficorn.vigor"
    :select="select"
  />
</template>

<script>
import { useStore } from '@/stores/player'
export default {
  props: {
    select: {
      type: Boolean,
      default: false,
    },
    bufficorns: {
      type: Array,
      require: true,
    }
  },
  setup () {
    const player = useStore()
    const bufficornsData = player.ranch.bufficorns
    return { bufficornsData }
  },
}
</script>