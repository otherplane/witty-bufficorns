<template>
  <div class="medals-container">
    <p class="medals-title">MEDALS</p>
    <div class="nft-container">
      <div
        v-for="preview in previews"
        :key="preview"
        v-html="preview"
        ref="creature"
        class="preview-nft"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    previews: Array
  }
}
</script>

<style lang="scss" scoped>
.nft-container {
  display: grid;
  margin: 16px 0px;
  justify-content: center;
  grid-template-columns: repeat(auto-fill, 50px);
  grid-gap: 16px;
  .preview-nft {
    width: 50px;
    padding: 8px;
    border-radius: 4px;
    background: var(--primary-color-opacity-2);
  }
}
.medals-title {
  font-weight: bold;
  font-family: Zilla Slab, sans-serif;
  font-size: 12px;
  color: var(--primary-color);
}
</style>
