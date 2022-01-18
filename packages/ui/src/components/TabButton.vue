<template>
  <button class="tab" :class="{ active }">
    {{ label.toUpperCase() }}
  </button>
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
.tab {
  width: 100%;
  color: $brown;
  padding: 4px 8px;
  background: $pink;
  border-radius: 4px;
  font-family: Zilla Slab;
  font-weight: bold;

  &.active {
    background: $brown;
    color: $pink;
  }
}
</style>
