<template>
  <div class="carousel relative rounded relative overflow-hidden">
    <div class="carousel-inner relative overflow-hidden w-full">
      <div v-for="(medal, index) in medals" :key="medal">
        <input
          class="carousel-open"
          type="radio"
          :id="`carousel-${getIndex(index)}`"
          name="carousel"
          aria-hidden="true"
          hidden=""
          checked="checked"
        />
        <div
          class="carousel-item absolute opacity-0 bg-center"
          style="height:max-content;"
        >
          <SvgImage
            v-if="!!medal.tokenId"
            class="preview-nft"
            :svg="medal.svg"
          />
          <SvgImage v-else class="preview-nft" :svg="medal" />
          <div v-if="!!medal.tokenId" class="opensea-link">
            <a :href="`${OPENSEA_BASE_URL}/${medal.tokenId}`" target="_blank">
              See on opensea
            </a>
            <svgImage class="external-link-icon" :svg="externalLink" />
          </div>
          <p class="items-count">{{ index + 1 }} of {{ medals.length }}</p>
        </div>
        <label
          v-if="medals.length > 1"
          :for="`carousel-${prevPage(getIndex(index), medals.length)}`"
          :class="
            `control-${getIndex(
              index
            )} w-10 h-10 ml-2 md:ml-10 absolute cursor-pointer hidden font-bold text-black rounded-full leading-tight text-center z-10 inset-y-0 left-0 my-auto flex justify-center content-center`
          "
        >
          <svgImage class="angle" :svg="angleLeft" />
        </label>
        <label
          v-if="medals.length > 1"
          :for="`carousel-${nextPage(getIndex(index), medals.length)}`"
          :class="
            `next control-${getIndex(
              index
            )} w-10 h-10 mr-2 md:mr-10 absolute cursor-pointer hidden font-bold text-black rounded-full leading-tight text-center z-10 inset-y-0 right-0 my-auto`
          "
        >
          <svgImage class="angle" :svg="angleRight" />
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import angleLeft from '@/assets/angle-left.svg?raw'
import { OPENSEA_BASE_URL } from '@/constants'
import angleRight from '@/assets/angle-right.svg?raw'
import externalLink from '@/assets/external-black.svg?raw'
export default {
  props: {
    medals: {
      type: Array,
      required: true
    }
  },
  setup (props) {
    function nextPage (index, itemsLength) {
      if (index === itemsLength) {
        return 1
      } else {
        return index + 1
      }
    }
    function prevPage (index, itemsLength) {
      if (index === 1) {
        return itemsLength
      } else {
        return index - 1
      }
    }
    function getIndex (index) {
      return index + 1
    }
    const svgTest = ''
    return {
      ref,
      nextPage,
      prevPage,
      getIndex,
      angleRight,
      angleLeft,
      OPENSEA_BASE_URL,
      externalLink,
      svgTest
    }
  }
}
</script>

<style lang="scss" scoped>
.carousel {
  width: 100%;
}
.carousel-open:checked + .carousel-item {
  position: static;
  opacity: 100;
}
.items-count {
  text-align: center;
  color: var(--primary-color);
  font-weight: bold;
}

.carousel-item {
  -webkit-transition: opacity 0.4s ease-out;
  transition: opacity 0.4s ease-out;
  padding: 16px;
  display: grid;
  grid-template-rows: max-content max-content;
  grid-template-columns: max-content;
  row-gap: 8px;
  justify-items: center;
}
.preview-nft {
  width: 300px;
  height: 150px;
  justify-content: center;
  display: flex;
  align-items: center;
}
.opensea-link {
  width: max-content;
  text-align: center;
  text-decoration: underline;
  .external-link-icon {
    display: inline-block;
  }
}

#carousel-1:checked ~ .control-1,
#carousel-2:checked ~ .control-2,
#carousel-3:checked ~ .control-3,
#carousel-4:checked ~ .control-4,
#carousel-5:checked ~ .control-5,
#carousel-6:checked ~ .control-6,
#carousel-7:checked ~ .control-7,
#carousel-8:checked ~ .control-8,
#carousel-9:checked ~ .control-9,
#carousel-10:checked ~ .control-10,
#carousel-11:checked ~ .control-11,
#carousel-12:checked ~ .control-12,
#carousel-13:checked ~ .control-13,
#carousel-14:checked ~ .control-14,
#carousel-15:checked ~ .control-15,
#carousel-16:checked ~ .control-16,
#carousel-17:checked ~ .control-17,
#carousel-18:checked ~ .control-18,
#carousel-19:checked ~ .control-19,
#carousel-20:checked ~ .control-20,
#carousel-21:checked ~ .control-21,
#carousel-22:checked ~ .control-22,
#carousel-23:checked ~ .control-23 {
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 330px) {
  .preview-nft {
    width: 200px;
  }
}
</style>
