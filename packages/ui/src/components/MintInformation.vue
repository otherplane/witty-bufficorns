<template>
  <div class="main-content">
    <div
      class="mint-status"
      v-if="player.mintInfo && player.mintInfo.transactionHash"
    >
      <p class="label">TRANSACTION HASH</p>
      <div class="address">
        <a
          :href="`${etherscanBaseUrl}/${player.mintInfo.transactionHash}`"
          target="_blank"
          >{{ player.mintInfo.transactionHash }}
        </a>
        <img class="external-link-icon" src="@/assets/external.svg" alt="" />
      </div>
    </div>
    <div
      class="mint-status"
      v-if="
        player.data &&
          player.data.tokenId &&
          parseInt(player.data.tokenId) !== 0
      "
    >
      <div class="opensea">
        <a :href="`${openseaBaseUrl}/${player.data.tokenId}`" target="_blank"
          >See on OpenSea
        </a>
        <img
          class="external-link-icon"
          src="@/assets/external-black.svg"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from '@/stores/player'
import { computed } from 'vue'
import imageUrl from '@/assets/egg-example.png'
import { ETHERSCAN_BASE_URL, OPENSEA_BASE_URL } from '../constants'

export default {
  setup () {
    const player = useStore()
    const mintStatus = computed(() =>
      player.mintInfo.blockHash ? 'minted' : 'pending'
    )

    return {
      etherscanBaseUrl: ETHERSCAN_BASE_URL,
      openseaBaseUrl: OPENSEA_BASE_URL,
      player,
      imageUrl,
      mintStatus
    }
  }
}
</script>

<style lang="scss" scoped>
.main-content {
  display: grid;
  row-gap: 48px;
}
</style>
