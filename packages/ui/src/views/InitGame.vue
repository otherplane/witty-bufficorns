<template>
  <MainLayout :isBackground="true" :isBufficorn="true">
    <div class="init-container">
      <img
        class="main-title"
        :src="importPng('main-title')"
        alt="Witty Bufficorns"
      />
      <router-link to="/disclaimer" class="link">
        <Button class="btn" type="dark">
          PLAY NOW
        </Button>
      </router-link>
    </div>
  </MainLayout>
</template>

<script>
import { importPng } from '@/composables/importPng.js'
export default {
  setup () {
    return { importPng }
  }
}
</script>

<style lang="scss" scoped>
.init-container {
  display: grid;
  max-height: 100vh;
  margin-top: 4vh;
  align-items: center;
  row-gap: 16px;
  .main-title {
    margin-bottom: 8px;
  }
  .main-subtile {
    font-family: Road Store;
    font-size: 74px;
    text-justify: center;
    color: $brown;
    text-align: center;
  }
  .main-subtile {
    font-size: 24px;
  }
  .link {
    width: max-content;
    justify-self: center;
  }
}
@media (max-width: 600px) {
  .init-container {
    .main-title,
    .main-subtile {
      font-family: Road Store;
      font-size: 48px;
      text-justify: center;
      color: $brown;
      text-align: center;
    }
    .main-subtile {
      font-size: 24px;
    }
  }
}
</style>
