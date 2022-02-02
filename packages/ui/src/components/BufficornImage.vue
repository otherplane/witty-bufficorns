<template>
  <div class="bufficorn-image-container">
    <div v-if="name" class="small-title item">
      <p class="bufficorn-name">{{ name }}</p>
    </div>
    <svgImage class="bufficorn-image" :class="{ flip }" :svg="bufficornMain" />
  </div>
</template>

<script>
import bufficornMain from '@/assets/bufficorn-main.svg?raw'
import SvgImage from './SvgImage.vue'
export default {
  components: { SvgImage },
  props: {
    name: String,
    flip: Boolean
  },
  setup () {
    return { bufficornMain }
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
  grid-column: 1;
  height: auto;
  width: 80px;
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
