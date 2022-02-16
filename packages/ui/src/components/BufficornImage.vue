<template>
  <div class="bufficorn-image-container" :class="{ horizontal }">
    <div v-if="horizontal" class="small-title item">
      <p class="bufficorn-name">{{ BUFFICORN_NAMES[name] }}</p>
    </div>
    <img
      v-if="ranchName"
      loading="lazy"
      :class="{ flip }"
      class="ranch-icon"
      :src="importSvg(RANCHES[ranchName])"
      alt="Bufficorn"
    />
    <picture>
      <source media="(max-width: 799px)" :srcset="importPng(`${name}480w`)" />
      <source media="(min-width: 800px)" :srcset="importPng(`${name}800w`)" />
      <source media="(min-width: 369px)" :srcset="importPng(`${name}`)" />
      <source media="(max-width: 368px)" :srcset="importPng(`${name}100w`)" />
      <img
        class="bufficorn-image"
        :class="{ flip, horizontal }"
        :src="importPng(name)"
        :srcset="
          `${importPng(`${name}100w`)} 100w, ${importPng(
            `${name}`
          )} 120w, ${importPng(`${name}480w`)} 480w, ${importPng(
            `${name}800w`
          )} 800w`
        "
      />
    </picture>
  </div>
</template>

<script>
import { importPng } from '@/composables/importPng.js'
import { importSvg } from '@/composables/importSvg.js'
import { RANCHES, BUFFICORN_NAMES } from '@/constants.js'
export default {
  props: {
    name: String,
    flip: Boolean,
    horizontal: Boolean,
    ranchName: String
  },
  setup () {
    return { importPng, importSvg, RANCHES, BUFFICORN_NAMES }
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
  width: 120px;
  height: 100%;
  margin-bottom: 16px;
  &.horizontal {
    grid-template-rows: max-content 120px;
    margin-bottom: 0px;
  }
}
.item {
  text-align: center;
}
.ranch-icon {
  height: 24px;
  position: absolute;
  left: 100px;
  bottom: 30px;
  &.flip {
    left: 176px;
  }
}
.bufficorn-image {
  object-fit: contain;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  grid-column: 1;
  &.horizontal {
    margin-bottom: 16px;
  }
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
