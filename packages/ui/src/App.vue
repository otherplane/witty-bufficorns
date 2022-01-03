<template>
  <router-view />
  <Notification />
</template>

<style lang="scss">
#app {
  font-family: Zilla Slab, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: grid;
  grid-template-rows: max-content 1fr;
  height: 100vh;
}
</style>
