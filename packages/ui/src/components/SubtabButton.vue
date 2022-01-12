<template>
  <button class="small-tab" :class="{ active }">
    {{ label }}
  </button>
</template>

<script setup>
defineProps({
  active: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    required: true
  }
})
</script>

<style scoped lang="scss">
.small-tab {
  color: $brown;
  font-family: Zilla Slab;
  font-weight: bold;

  &.active {
    text-decoration: underline;
  }
}
</style>
