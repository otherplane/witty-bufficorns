<template>
  <div v-if="player.mintInfo" class="mint-content shadow-xl">
    <LabelMintStatus v-if="player.mintInfo" :status="mintStatus" />
    <p class="label">TRANSACTION HASH</p>
    <div class="mint-status" v-if="player?.mintInfo?.transactionHash">
      <div class="info address">
        <a
          :href="`${etherscanBaseUrl}/${player.mintInfo.transactionHash}`"
          target="_blank"
          >{{ player.mintInfo.transactionHash }}
        </a>
        <img
          class="external-link-icon"
          src="@/assets/external-black.svg"
          alt=""
        />
      </div>
    </div>
    <div class="mint-status" v-if="parseInt(player?.data?.tokenId) !== 0">
      <div class="info opensea">
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
.mint-content {
  border: 1px solid $brown;
  justify-items: center;
  border-radius: 4px;
  display: grid;
  row-gap: 8px;
  padding: 16px;
  margin-bottom: 16px;
  .external-link-icon {
    margin-left: 8px;
    width: 10px;
  }
  .label {
    font-weight: bold;
  }
  .info {
    font-size: 16px;
    color: $black;
    justify-content: center;
    text-decoration: underline;
    display: flex;
  }
}
</style>
