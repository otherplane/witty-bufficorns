<template>
  <button class="btn" :class="[type]">
    <slot class="btn-content"> </slot>
  </button>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'default',
      validator (value) {
        return ['primary', 'secondary', 'disable', 'dark'].includes(value)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.btn {
  width: 100%;
  color: white;
  padding: 16px 16px;
  border-radius: 4px;
  font-family: Zilla Slab;
  font-weight: bold;

  &.primary {
    color: $black;
    background: $orange;
  }
  &.secondary {
    color: $black;
    background: $transparent;
    border: 1px solid $orange;
  }
  &.dark {
    color: $brown;
    background: $beige;
  }
  &.disable {
    opacity: 0.6;
    cursor: no-drop;
  }
}
</style>
