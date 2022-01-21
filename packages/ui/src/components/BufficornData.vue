<template>
  <div class="bufficorn-list-container">
    <input
      class="select custom"
      v-if="selectable"
      type="radio"
      v-model="player.selectedBufficorn"
      :value="name"
    />
    <FlipCard
      :bufficorn-list="bufficornList"
      :index="index"
      :key="name"
      :name="name"
      :background-front="backgroundFront"
      :background-back="backgroundBack"
      :attributes="{
        vigor: attributes.vigor,
        agility: attributes.agility,
        speed: attributes.speed,
        coolness: attributes.coolness,
        coat: attributes.coat,
        stamina: attributes.stamina
      }"
      :horizontal="horizontal"
    />
  </div>
</template>

<script>
import { useStore } from '@/stores/player'

export default {
  props: {
    index: Number,
    attributes: {
      vigor: Number,
      stamina: Number,
      speed: Number,
      agility: Number,
      coat: Number,
      coolness: Number
    },
    bufficornList: {
      type: Array,
      required: true
    },
    name: String,
    horizontal: {
      type: Boolean,
      default: false
    },
    selectable: {
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
  setup () {
    const player = useStore()
    return { player }
  }
}
</script>

<style scoped lang="scss">
.bufficorn-list-container {
  grid-gap: 8px;
  display: grid;
  justify-items: center;
  grid-template-columns: 1fr;
  align-items: center;
}
</style>
