<template>
  <MainLayout>
    <div class="disclaimer">
      <p class="title">TRADE</p>
      <BufficornsList :selectable="true" />
      <Button type="dark" @click="trade">
        TRADE
      </Button>
    </div>
  </MainLayout>
</template>

<script>
import { useStore } from '@/stores/player'
import { useRouter } from 'vue-router'
import { onBeforeMount, ref } from 'vue'

export default {
  setup () {
    const player = useStore()
    const router = useRouter()

    onBeforeMount(async () => {
      if (!player.ranch.bufficorns) {
        router.push('/')
      }
    })

    const trade = () => {
      player.trade({ key: router.currentRoute.value.params.id })
    }

    return { trade }
  }
}
</script>

<style lang="scss" scoped>
.disclaimer {
  text-align: center;
  display: grid;
  row-gap: 24px;
  .btn {
    width: max-content;
    justify-self: center;
  }
}
</style>
