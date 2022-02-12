<template>
  <div class="medals-container" v-if="player.previews.length > 1">
    <p class="medals-title">{{ title }}</p>
    <div v-if="player.mintedAwards" class="nft-container">
      <a
        v-for="mintedAward in player.mintedAwards"
        :href="`${OPENSEA_BASE_URL}/${mintedAward.tokenId}`"
        :key="mintedAward"
        target="_blank"
      >
        <img
          class="preview-nft minted"
          :src="importSvg(mintedAward.image)"
          alt="icon"
        />
      </a>
    </div>
    <div v-else class="nft-container">
      <img
        v-for="preview in player.previews"
        :key="preview"
        class="preview-nft"
        :src="importSvg(preview)"
        alt="icon"
      />
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
    return { importSvg, title, player, OPENSEA_BASE_URL }
  }
}
</script>

<style lang="scss" scoped>
.nft-container {
  display: grid;
  margin: 16px 0px;
  justify-content: center;
  grid-template-columns: repeat(auto-fill, 50px);
  grid-gap: 16px;
  .preview-nft {
    width: 50px;
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
