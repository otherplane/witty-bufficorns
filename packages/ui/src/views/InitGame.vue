<template>
  <MainLayout :isBackground="true">
    <div class="init-container">
      <h1 class="main-title">WITTY BUFFICORNS</h1>
      <h2 class="main-subtile">A SOCIAL GAME BY WITNET X ETHDENVER</h2>
      <router-link to="/disclaimer" class="link">
        <Button class="btn" type="dark">
          PLAY NOW
        </Button>
      </router-link>
    </div>
  </MainLayout>
</template>

<style lang="scss" scoped>
.init-container {
  display: grid;
  align-items: center;
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
    margin-top: 24px;
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
