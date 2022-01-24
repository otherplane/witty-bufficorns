<template>
  <div class="header">
    <router-link to="/">
      <div class="back-container">
        <img class="angle" src="@/assets/angle-left.svg" alt="angle-left" />
        <p>BACK</p>
      </div>
    </router-link>
    <router-link to="/">
      <img class="ranch-img" src="@/assets/ranchLogo.svg" alt="Back button" />
    </router-link>
    <h3 class="title-section">{{ title }}</h3>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
.header {
  display: grid;
  justify-items: center;
  grid-template-rows: max-content 1fr;
  align-items: center;
  column-gap: 24px;
  .back-container {
    position: absolute;
    display: flex;
    top: 16px;
    left: 16px;
    font-weight: 600;
    color: $brown;
  }
  .angle {
    margin-right: 8px;
  }
  .ranch-img {
    width: 138px;
  }
  .title-section {
    font-family: Road Store;
    font-size: 24px;
    font-weight: bold;
    color: $brown;
  }
}
</style>
