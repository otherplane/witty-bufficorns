<template>
  <router-view />
  <Notification />
</template>

<script>
import { getCurrentInstance } from 'vue'

export default {
  setup () {
    const useImage = url => {
      return new URL(`/src/${url}`, import.meta.url).href
    }
    getCurrentInstance().appContext.config.globalProperties.$image = useImage
  }
}
</script>

<style lang="scss">
#app {
  font-family: Zilla Slab, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: grid;
  grid-template-rows: max-content 1fr;
}
</style>
