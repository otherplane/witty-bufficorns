<template>
  <div v-if="egg.username" class="container-egg">
    <div class="egg-content">
      <div>
        <p class="subtitle">EGG ID: {{ egg.username }}</p>
        <p class="title">My Witty Creature</p>
      </div>
      <WittyCreature
        v-if="egg.creaturePreview"
        :creature-preview="egg.creaturePreview"
      />
      <div
        class="mint-status"
        v-if="egg.mintInfo && egg.mintInfo.transactionHash"
      >
        <p class="label">TRANSACTION HASH</p>
        <div class="address">
          <a
            :href="`${etherscanBaseUrl}/${egg.mintInfo.transactionHash}`"
            target="_blank"
            >{{ egg.mintInfo.transactionHash }}
          </a>
          <img class="external-link-icon" src="@/assets/external.svg" alt="" />
        </div>
      </div>
      <div
        class="mint-status"
        v-if="
          egg.creatureData &&
            egg.creatureData.tokenId &&
            parseInt(egg.creatureData.tokenId) !== 0
        "
      >
        <div class="opensea">
          <a
            :href="`${openseaBaseUrl}/${egg.creatureData.tokenId}`"
            target="_blank"
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
    <div class="buttons">
      <Button
        v-if="egg.hasBorn && !egg.creaturePreview"
        @click="openModal('openEgg')"
        color="black"
        class="center-item"
      >
        Open my egg
      </Button>
      <Button
        v-else-if="egg.hasBorn && egg.creaturePreview"
        @click="mint"
        :type="type"
        color="black"
        class="center-item"
      >
        Mint NFT
      </Button>

      <Button @click="openModal('export')" color="grey" class="center-item">
        Eggxport &trade;
      </Button>
      <p class="footer">
        powered by
        <a class="link" href="https://witnet.io" target="_blank">Witnet</a>
      </p>
    </div>
  </div>

  <ModalDialog :show="modal.visible.value" v-on:close="closeModal">
    <ModalExport v-if="modals.export" />
    <GameOverModal v-if="modals.gameOver" />
    <ModalMint v-if="modals.mint" />
    <ModalOpenEgg v-if="modals.openEgg" />
  </ModalDialog>
</template>

<script>
import { useEggStore } from '@/stores/egg'
import { computed, onBeforeMount, onBeforeUnmount, reactive, ref } from 'vue'
import imageUrl from '@/assets/egg-example.png'
import { useModal } from '@/composables/useModal'
import { useWeb3Witmon } from '../composables/useWeb3Witmon'
import { ETHERSCAN_BASE_URL, OPENSEA_BASE_URL } from '../constants'

export default {
  setup () {
    const modal = useModal()
    const egg = useEggStore()
    const web3Witmon = useWeb3Witmon()
    const modals = reactive({
      mint: false,
      export: false,
      openEgg: false,
      gameOver: false
    })
    const hasBorn = egg.hasBorn
    let timeout

    onBeforeMount(async () => {
      await egg.getEggInfo()
      await egg.getMintInfo()
      await egg.getPreview()
      if (egg.hasBorn) {
        const data = await web3Witmon.getCreatureData()
        egg.setCreatureData(data)
      }

      if (!egg.hasBorn) {
        timeout = setTimeout(() => {
          egg.timeToBirth -= 1
        }, egg.timeToBirth - Date.now())
      }
    })

    onBeforeUnmount(() => {
      clearTimeout(timeout)
    })

    const type = computed(() =>
      egg.incubating ||
      (egg.creatureData && parseInt(egg.creatureData.tokenId) !== 0)
        ? 'disable'
        : 'default'
    )
    const mintStatus = computed(() =>
      egg.mintInfo.blockHash ? 'minted' : 'pending'
    )

    function incubateMyEgg () {
      if (type.value !== 'disable') {
        egg.incubateEgg({ key: egg.id })
      }
    }

    function openModal (name) {
      const needProvider = name === 'mint' || name === 'openEgg'
      if (!web3Witmon.isProviderConnected.value && needProvider) {
        modals['gameOver'] = true
      } else {
        modals[name] = true
      }
      modal.showModal()
    }

    function closeModal () {
      modals.mint = false
      modals.export = false
      modals.openEgg = false
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
      hasBorn,
      egg,
      type,
      incubateMyEgg,
      closeModal,
      openModal,
      imageUrl,
      modal,
      modals,
      mintStatus,
      enableProvider: web3Witmon.enableProvider,
      openEgg: web3Witmon.openEgg,
      isProviderConnected: web3Witmon.isProviderConnected,
      getCreatureData: web3Witmon.getCreatureData
    }
  }
}
</script>
