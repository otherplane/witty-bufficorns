<template>
  <Carousel>
    <Slide v-for="medal in medals" :key="medal">
      <div class="carousel__item">
        <SvgImage v-if="!!medal.tokenId" class="preview-nft" :svg="medal.svg" />
        <SvgImage v-else class="preview-nft" :svg="medal" />
        <div v-if="!!medal.tokenId" class="opensea-link">
          <a :href="`${OPENSEA_BASE_URL}/${medal.tokenId}`" target="_blank">
            See on opensea
          </a>
          <svgImage class="external-link-icon" :svg="externalLink" />
        </div>
      </div>
    </Slide>
    <template #addons>
      <Pagination />
    </template>
  </Carousel>
</template>

<script>
// If you are using PurgeCSS, make sure to whitelist the carousel CSS classes
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import { OPENSEA_BASE_URL } from '@/constants'
import externalLink from '@/assets/external-black.svg?raw'

export default {
  name: 'App',
  components: {
    Carousel,
    Slide,
    Pagination,
    Navigation
  },
  props: {
    medals: {
      type: Array,
      required: true
    }
  },
  setup () {
    return {
      OPENSEA_BASE_URL,
      externalLink
    }
  }
}
</script>
<style lang="scss">
// .navigation-btn {
//   position: fixed;
//   margin: 0 auto;
//   left: 40px;
//   width: 80vw;
// }
.carousel__item {
  width: 150px;
  display: grid;
  .opensea-link {
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
