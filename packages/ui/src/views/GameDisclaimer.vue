<template>
  <MainLayout :isBackground="true">
    <div class="container">
      <img :src="importPng('main-title')" alt="WittyBufficorns" />
      <p class="text">
        <span class="bold">DISCLAIMER:</span> Once you register your farmer, it
        will be forever linked to your web browser and the QR code will not work
        in a different browser. You are highly encouraged to create a backup
        from the main screen of the game, or in case that you need to move your
        profile into a different browser.
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
import { importPng } from '@/composables/importPng.js'
export default {
  setup () {
    return { importPng }
  }
}
</script>

<style lang="scss" scoped>
.container {
  margin-top: 4vh;
}
.btn {
  width: max-content;
}
.text {
  font-family: Zilla Slab, sans-serif;
  font-size: 16px;
  color: $black;
  font-weight: bold;
}
</style>
