<template>
  <img id="medal-img" :src="url" />
</template>

<script>
export default {
  props: {
    svg: { type: String, required: true }
  },
  setup (props) {
    let blob = new Blob([props.svg], { type: 'image/svg+xml' })
    let url = URL.createObjectURL(blob)
    return { url }
  }
}
</script>

<style lang="scss">
.fill-primary {
  fill: var(--primary-color);
}
.stroke-primary {
  stroke: var(--primary-color);
}
</style>
