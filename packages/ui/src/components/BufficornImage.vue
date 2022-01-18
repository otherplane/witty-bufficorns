<template>
  <div class="bufficorn-image-container">
    <div class="small-title item">
      <p class="bufficorn-name">{{ name }}</p>
    </div>
    <img class="bufficorn-image" src="@/assets/bufficorn.svg" alt="Bufficorn" />
  </div>
</template>

<script>
export default {
  props: {
    name: String
  }
}
</script>

<style scoped lang="scss">
.bufficorn-image-container {
  display: grid;
  grid-template-rows: 1fr 1fr;
  justify-content: center;
}
.bufficorn-name {
  color: $brown;
}
.item {
  padding: 8px;
  text-align: center;
}
.bufficorn-image {
  grid-column: 1;
  height: auto;
  width: 80px;
}
</style>
