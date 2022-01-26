<template>
  <MainLayout>
    <div class="container">
      <p class="title">DISCLAIMER</p>
      <p class="text">
        <span class="bold">Remember:</span> once you register your farmer, it
        will be forever linked to your web browser and the QR code will not work
        in a different browser. You are highly encouraged to create a backup
        from the main screen of the game, or in case that you need to move your
        egg into a different browser.
      </p>
      <router-link to="/scan" class="link">
        <Button class="btn" type="dark">
          CONTINUE
        </Button>
      </router-link>
    </div>
  </MainLayout>
</template>

<style lang="scss" scoped>
.btn {
  width: max-content;
}
</style>
