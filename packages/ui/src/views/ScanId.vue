<template>
  <MainLayout :padding="false">
    <QrStream class="qr-code pl-4 pr-4 pb-4" @decode="onDecode"></QrStream>
    <div class="content">
      <p class="small-title import-label">Scan a QR code</p>
      <Button
        v-if="VITE_TEST"
        class="btn"
        type="primary"
        :slim="true"
        @click="onDecode('https://bufficorns.com/#/4b3fa3d0d4c085b6')"
      >
        A
      </Button>
      <Button
        v-if="VITE_TEST"
        class="btn"
        type="primary"
        :slim="true"
        @click="onDecode('https://bufficorns.com/#/d248e4009b8d5bd8')"
      >
        B
      </Button>
      <Button
        v-if="VITE_TEST"
        class="btn"
        type="primary"
        :slim="true"
        @click="onDecode('https://bufficorns.com/#/60723c0283542b2a')"
      >
        C
      </Button>
      <Button
        v-if="VITE_TEST"
        class="btn"
        type="primary"
        :slim="true"
        @click="onDecode('https://bufficorns.com/#/d7f743c226e9fd8e')"
      >
        D
      </Button>
      <Button
        v-if="VITE_TEST"
        class="btn"
        type="primary"
        :slim="true"
        @click="onDecode('https://bufficorns.com/#/d4aa3feb7a6eb1be')"
      >
        E
      </Button>
      <Button
        v-if="VITE_TEST"
        class="btn"
        type="primary"
        :slim="true"
        @click="onDecode('https://bufficorns.com/#/dbe8cdf86dc53025')"
      >
        F
      </Button>
      <Button
        v-if="VITE_TEST"
        class="btn"
        type="primary"
        :slim="true"
        @click="onDecode('https://bufficorns.com/#/ac850781190585d2')"
      >
        G
      </Button>
      <Button
        v-if="VITE_TEST"
        class="btn"
        type="primary"
        :slim="true"
        @click="onDecode('https://bufficorns.com/#/1f5f3e0883be2866')"
      >
        H
      </Button>
    </div>
    <ModalDialog :show="modal.visible.value" v-on:close="modal.hideModal">
      <ModalClaimConfirmation v-on:claim="register" />
    </ModalDialog>
  </MainLayout>
</template>

<script>
import { ref } from 'vue'
import { useStore } from '@/stores/player'
import { QrStream } from 'vue3-qr-reader'
import { useRouter } from 'vue-router'
import { useModal } from '../composables/useModal'
import { BASE_URL, VITE_TEST } from '../constants'

export default {
  components: {
    QrStream
  },
  setup (props, ctx) {
    const modal = useModal()
    const player = useStore()
    const playerKey = ref(null)
    const decodedString = ref('')

    const router = useRouter()
    const previousRoute = ref('')

    function submitAndRedirect () {
      router.push({ name: 'main', params: { id: playerKey.value } })
    }

    async function onDecode (value) {
      if (value) {
        if (!value.includes(BASE_URL)) {
          await player.getBonus(value)
          router.push('/')
        } else {
          decodedString.value = value
          if (!player.getToken()) {
            modal.showModal()
          } else {
            register()
          }
        }
      }
    }

    function register () {
      const chunks = decodedString.value.split('/')
      const key = chunks[chunks.length - 1]
      if (key) {
        playerKey.value = key
        submitAndRedirect()
      }
    }

    return {
      player,
      playerKey,
      submitAndRedirect,
      onDecode,
      previousRoute,
      register,
      modal,
      VITE_TEST
    }
  },

  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.previousRoute = from.path
    })
  }
}
</script>

<style lang="scss" scoped>
.qr-code {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 8;
}
.pl-4 {
  padding-bottom: 0;
  padding-right: 0;
  padding-left: 0;
}
.content {
  color: $white;
  width: 100vw;
  top: 10vh;
  left: 0px;
  position: fixed;
  text-align: center;
  z-index: 9;
}
</style>
