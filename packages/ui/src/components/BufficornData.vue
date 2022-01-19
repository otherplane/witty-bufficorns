<template>
  <div class="bufficorn-list-container">
    <input
      class="select custom"
      v-if="selectable"
      type="radio"
      v-model="player.selectedBufficorn"
      :value="name"
    />
    <div class="card-container">
      <div
        class="card"
        @click="showStats = !showStats"
        :class="{ flipped: showStats }"
      >
        <div class="face front">
          <BufficornImage :name="name" />
        </div>
        <div class="face back">
          <BufficornAttributesList :attributes="attributes" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from '@/stores/player'
import { ref } from 'vue'

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
    name: String,
    selectable: {
      type: Boolean,
      default: false
    }
  },
  setup () {
    const player = useStore()
    const showStats = ref(false)
    return { player, showStats }
  }
}
</script>

<style scoped lang="scss">
.card-container {
  width: 160px;
  height: 300px;
  perspective: 600px;
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
}

.front {
  background-color: $opacity-beige;
}

.back {
  display: grid;
  justify-content: center;
  grid-template-rows: repeat(2, max-content);
  row-gap: 4px;
  justify-items: center;
  align-content: center;
  transform: rotateY(180deg);
}

.bufficorn-list-container {
  grid-gap: 8px;
  display: grid;
  justify-items: center;
  grid-template-columns: 1fr;
  align-items: center;
}
</style>
