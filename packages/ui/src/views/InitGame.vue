<template>
  <MainLayout :isBackground="true">
    <router-link to="/disclaimer" class="link">
      <Button class="btn" type="dark">
        PLAY NOW
      </Button>
    </router-link>
  </MainLayout>
</template>

<style lang="scss" scoped>
.link {
  margin-top: 60vh;
  width: max-content;
  justify-self: center;
}
</style>
