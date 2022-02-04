<template>
  <div class="bufficorn-image-container">
    <div v-if="name" class="small-title item">
      <p class="bufficorn-name">{{ name }}</p>
    </div>
    <img
      class="bufficorn-image"
      :class="{ flip }"
      :src="importPng('Bufficorn-2')"
      alt="icon"
    />
  </div>
</template>

<script>
import { importPng } from '@/composables/importPng.js'
export default {
  props: {
    name: String,
    flip: Boolean
  },
  setup () {
    return { importPng }
  }
}
</script>

<style scoped lang="scss">
.bufficorn-image-container {
  display: grid;
  grid-template-rows: max-content;
  justify-items: center;
  align-items: center;
  align-content: center;
  height: 100%;
}
.item {
  text-align: center;
}
.bufficorn-image {
  object-fit: contain; 
  width: auto; 
  height: auto; 
  max-width: 100%; 
  max-height: 100%;
  grid-column: 1;
  &.flip {
    -moz-transform: scaleX(-1);
    -webkit-transform: scaleX(-1);
    -o-transform: scaleX(-1);
    transform: scaleX(-1);
    -ms-filter: fliph;
    filter: fliph;
  }
}
</style>
