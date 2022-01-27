<template>
  <MainLayout :isBackground="true">
    <div class="container">
      <svgImage :svg="disclaimerTitle" />
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

<script>
import disclaimerTitle from '@/assets/disclaimerTitle.svg?raw'
export default {
  setup () {
    return { disclaimerTitle }
  }
}
</script>

<style lang="scss" scoped>
.btn {
  width: max-content;
}
.text {
  font-family: Zilla Slab, sans-serif;
  color: $black;
  font-weight: bold;
}
</style>
