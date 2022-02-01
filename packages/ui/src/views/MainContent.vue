<template>
  <MainLayout v-if="player.username">
    <div class="main-content">
      <div class="header">
        <div class="farmer-info">
          <NavBar class="navbar" @openExportModal="openModal('export')" />
          <p class="subtitle player-id">{{ player.username.toUpperCase() }}</p>
          <p class="subtitle">
            <span class="points-bold">{{ player.playerPoints }}</span> points
          </p>
          <p class="subtitle">
            <span class="subtitle label">ID: </span>{{ player.id }}
          </p>
          <p class="subtitle">
            <span class="subtitle label">RANCH RESOURCE:</span>
            {{ player.ranch.trait }}
          </p>
          <p class="subtitle">
            <span class="subtitle label">GAME ENDS IN:</span>
            <TimeLeft
              class="time-left"
              :timestamp="1645376400000"
              :seconds="true"
            />
          </p>
        </div>
        <img
          class="logo"
          :src="importSvg(RANCHES[player.theme])"
          alt="Witty Bufficorns ranch logo"
        />
      </div>
      <TradeInfo />
      <NFTPreview v-if="previews.length" :previews="previews" />
      <MintInformation />
      <BufficornsList v-if="player.bufficornsGlobalStats" :selectable="true" />
      <router-link
        v-if="!player.gameOver"
        class="sticky-btn"
        :to="type === 'disable' ? '' : '/scan'"
      >
        <Button type="dark" :slim="true">
          TRADE
        </Button>
      </router-link>
      <div class="sticky-btn" v-if="player.gameOver">
        <Button
          v-if="!player.preview"
          @click="openModal('preview')"
          type="dark"
          :slim="true"
        >
          PREVIEW NFT
        </Button>
        <Button
          v-else-if="player.preview"
          @click="mint"
          type="dark"
          :slim="true"
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
import { useModal } from '@/composables/useModal'
import { useWeb3 } from '../composables/useWeb3'
import { ETHERSCAN_BASE_URL, OPENSEA_BASE_URL, RANCHES } from '../constants'
import { importSvg } from '@/composables/importSvg.js'

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
      modal,
      modals,
      mintStatus,
      enableProvider: web3WittyBufficorns.enableProvider,
      previews: web3WittyBufficorns.preview,
      isProviderConnected: web3WittyBufficorns.isProviderConnected,
      getData: web3WittyBufficorns.getData,
      importSvg,
      RANCHES
    }
  }
}
</script>

<style lang="scss" scoped>
.main-content {
  margin-top: 16px;
}
.time-left {
  margin-left: 4px;
}
.header {
  display: grid;
  grid-template-columns: max-content 1fr;
  justify-items: flex-end;
  align-items: flex-end;
  margin-bottom: 8px;
  .logo {
    align-self: center;
    width: 150px;
    height: 148px;
  }
  .navbar {
    top: 8px;
    grid-row: 1;
  }
  .player-id {
    font-family: Road Store;
    font-size: 18px;
    color: var(--primary-color);
    font-weight: bold;
  }
  .points-bold {
    font-weight: bold;
    font-size: 18px;
  }
}
.sticky-btn {
  position: sticky;
  bottom: 24px;
  text-align: center;
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
