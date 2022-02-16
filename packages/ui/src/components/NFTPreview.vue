<template>
  <div class="medals-container" v-if="player.previews.length >= 1">
    <p class="medals-title">{{ title }}</p>
    <div class="nft-container">
      <CarouselMedals :medals="medals" />
    </div>
  </div>
</template>

<script>
import { importSvg } from '@/composables/importSvg.js'
import { computed } from 'vue'
import { useStore } from '@/stores/player'
import { OPENSEA_BASE_URL } from '../constants'
export default {
  setup () {
    const player = useStore()
    const title = computed(() => {
      return player.mintedAwards ? 'NFT AWARDS' : 'NFT AWARDS (PREVIEW)'
    })
    const medals = computed(() => {
      if (player.mintedAwards.length) {
        return player.mintedAwards
      } else {
        return player.previews
      }
    })
    return { importSvg, title, player, OPENSEA_BASE_URL, medals }
  }
}
</script>

<style lang="scss" scoped>
.nft-container {
  display: grid;
  background: var(--primary-color-opacity-2);
  border-radius: 4px;
  margin: 16px 0px;
  justify-content: center;
  .preview-nft {
    width: 200px;
    padding: 8px;
    border-radius: 4px;
    background: var(--primary-color-opacity-2);
    &.minted {
      border: 2px solid var(--primary-color);
    }
  }
}
.medals-title {
  font-weight: bold;
  font-family: Zilla Slab, sans-serif;
  font-size: 12px;
  color: var(--primary-color);
}
</style>
