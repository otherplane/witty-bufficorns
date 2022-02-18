<template>
  <Carousel>
    <Slide v-for="(medal, index) in medals" :key="medal">
      <div class="carousel__item">
        <SvgImage v-if="!!medal.tokenId" class="preview-nft" :svg="medal.svg" />
        <SvgImage v-else class="preview-nft" :svg="medal" />
        <div v-if="!!medal.tokenId" class="opensea-link">
          <a :href="`${OPENSEA_BASE_URL}/${medal.tokenId}`" target="_blank">
            See on opensea
          </a>
          <svgImage class="external-link-icon" :svg="externalLink" />
        </div>
        <p class="medals-number">{{ index + 1 }} of {{ medals.length }}</p>
      </div>
    </Slide>
    <template #addons>
      <Pagination />
    </template>
  </Carousel>
</template>

<script>
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination } from 'vue3-carousel'
import { OPENSEA_BASE_URL } from '@/constants'
import externalLink from '@/assets/external-black.svg?raw'

export default {
  name: 'App',
  components: {
    Carousel,
    Slide,
    Pagination
  },
  props: {
    medals: {
      type: Array,
      required: true
    }
  },
  setup (props) {
    return {
      OPENSEA_BASE_URL,
      externalLink
    }
  }
}
</script>
<style lang="scss">
.carousel__item {
  cursor: grab;
  width: 150px;
  display: grid;
  .medals-number {
    margin-top: 16px;
    font-weight: bold;
    color: var(--primary-color);
  }
  .opensea-link {
    margin-top: 8px;
    display: flex;
    cursor: pointer;
    text-decoration: underline;
    width: 100%;
    justify-content: center;
    .external-link-icon {
      width: 10px;
      margin-left: 4px;
      display: inline-block;
    }
  }
}
</style>
