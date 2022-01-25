<template>
  <MainLayout v-if="player.username">
    <div class="main-content">
      <div class="header">
        <div class="farmer-info">
          <NavBar class="navbar" @openExportModal="openModal('export')" />
          <p class="subtitle">{{ player.username.toUpperCase() }}</p>
          <p class="subtitle">
            <span class="subtitle label">RANCH RESOURCE:</span>
            {{ player.ranch.trait }}
          </p>
          <p class="subtitle">
            <span class="subtitle label">GAME ENDS IN:</span>
            <TimeLeft
              class="time-left"
              :timestamp="1644568954000"
              :seconds="true"
            />
          </p>
        </div>
        <img
          class="logo"
          src="@/assets/ranchLogo.svg"
          alt="Witty Bufficorns ranch logo"
        />
      </div>
      <TradeInfo />
      <NFTPreview v-if="player.preview" :preview="player.preview" />
      <MintInformation />
      <BufficornsList v-if="player.bufficornsGlobalStats" />
      <router-link
        v-if="!player.gameOver"
        class="trade-btn"
        :to="type === 'disable' ? '' : '/scan'"
      >
        TRADE
      </router-link>
      <div class="buttons" v-if="player.gameOver">
        <Button
          v-if="!player.preview"
          @click="openModal('preview')"
          type="dark"
          class="center-item"
        >
          PREVIEW NFT
        </Button>
        <Button
          v-else-if="player.preview"
          @click="mint"
          type="dark"
          class="center-item"
        >
          MINT NFT
        </Button>
      </div>
    </div>
  </MainLayout>

  <ModalDialog :show="modal.visible.value" v-on:close="closeModal">
    <ModalExport v-if="modals.export" />
    <GameOverModal v-if="modals.gameOver" />
    <ModalMint v-if="modals.mint" />
    <ModalPreview v-if="modals.preview" />
  </ModalDialog>
</template>

<script>
import { useStore } from '@/stores/player'
import { computed, onBeforeMount, onBeforeUnmount, reactive, ref } from 'vue'
import imageUrl from '@/assets/egg-example.png'
import { useModal } from '@/composables/useModal'
import { useWeb3 } from '../composables/useWeb3'
import { ETHERSCAN_BASE_URL, OPENSEA_BASE_URL } from '../constants'

export default {
  setup () {
    const modal = useModal()
    const player = useStore()
    const web3WittyBufficorns = useWeb3()
    const modals = reactive({
      mint: false,
      export: false,
      preview: false,
      gameOver: false
    })
    const gameOver = player.gameOver
    let timeout

    onBeforeMount(async () => {
      await player.getInfo()
      await player.getGlobalStats()
      await player.getMintInfo()
      await player.getPreview()
      if (player.gameOver) {
        const data = await web3WittyBufficorns.getData()
        player.setData(data)
      }

      if (!player.gameOver) {
        timeout = setTimeout(() => {
          player.timeToBirth -= 1
        }, player.timeToBirth - Date.now())
      }
    })

    onBeforeUnmount(() => {
      clearTimeout(timeout)
    })

    const type = computed(() =>
      // TODO: update player.incubating naming when contracts are available
      player.incubating || (player.data && parseInt(player.data.tokenId) < 0)
        ? 'disable'
        : 'primary'
    )
    const mintStatus = computed(() =>
      player.mintInfo.blockHash ? 'minted' : 'pending'
    )

    function openModal (name) {
      const needProvider = name === 'mint' || name === 'preview'
      if (!web3WittyBufficorns.isProviderConnected.value && needProvider) {
        modals['gameOver'] = true
      } else {
        modals[name] = true
      }
      modal.showModal()
    }

    function closeModal () {
      modals.mint = false
      modals.export = false
      modals.preview = false
      modals.gameOver = false
      modal.hideModal()
    }

    function mint () {
      if (type.value !== 'disable') {
        openModal('mint')
      }
    }

    return {
      etherscanBaseUrl: ETHERSCAN_BASE_URL,
      openseaBaseUrl: OPENSEA_BASE_URL,
      mint,
      gameOver,
      player,
      type,
      closeModal,
      openModal,
      imageUrl,
      modal,
      modals,
      mintStatus,
      enableProvider: web3WittyBufficorns.enableProvider,
      preview: web3WittyBufficorns.preview,
      isProviderConnected: web3WittyBufficorns.isProviderConnected,
      getData: web3WittyBufficorns.getData
    }
  }
}
</script>

<style lang="scss" scoped>
.time-left {
  margin-left: 4px;
}
.main-content {
  display: grid;
  row-gap: 16px;
}
.header {
  display: grid;
  grid-template-columns: max-content 1fr;
  justify-items: flex-end;
  align-items: flex-end;
  .farmer-info {
    margin-top: 34px;
  }
  .logo {
    align-self: center;
    width: 150px;
  }
  .navbar {
    top: 8px;
    grid-row: 1;
  }
}
.trade-btn {
  font-family: Road Store;
  color: $brown;
  font-size: 18px;
  font-weight: bold;
  background-color: $pink;
  position: fixed;
  right: 8px;
  bottom: 8px;
  padding: 8px;
  border-radius: 4px;
  .trade-img {
    width: 48px;
  }
}
.buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: max-content;
  justify-self: center;
  grid-template-rows: auto auto;
  grid-gap: 16px;
  .center-item {
    grid-column: 1 / span 2;
    align-self: center;
    width: max-content;
    justify-self: center;
  }
}
@media (max-width: 330px) {
  .header {
    grid-template-columns: 1fr;
    justify-items: flex-start;
    align-items: flex-start;

    .farmer-info {
      margin-top: 24px;
    }
    .logo {
      grid-row: 1;
      width: 150px;
      margin-top: 28px;
      justify-self: center;
    }
  }
}
</style>
