<template>
  <MainLayout :isBackground="true" :isBufficorn="true">
    <div class="init-container">
      <svgImage :svg="title" />
      <router-link to="/disclaimer" class="link">
        <Button class="btn" type="dark">
          PLAY NOW
        </Button>
      </router-link>
    </div>
  </MainLayout>
</template>

<script>
import title from '@/assets/mainTitle.svg?raw'
export default {
  setup () {
    return { title }
  }
}
</script>

<style lang="scss" scoped>
.init-container {
  display: grid;
  margin-top: 4vh;
  align-items: center;
  row-gap: 16px;
  .main-title,
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
