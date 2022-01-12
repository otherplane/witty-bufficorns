<template>
  <div v-html="preview" ref="creature" class="preview-nft"></div>
</template>

<script>
export default {
  props: {
    preview: String
  }
}
</script>
