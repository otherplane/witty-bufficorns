<template>
  <button class="btn" :class="{ [type]: type, slim }">
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
    },
    slim: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped lang="scss">
.btn {
  width: 100%;
  color: $white;
  padding: 10px 16px;
  border-radius: 4px;
  font-family: Road Store, sans-serif;
  font-weight: bold;
  &.primary {
    color: $white;
    background: var(--primary-color);
  }
  &.secondary {
    color: $black;
    background: $transparent;
    border: 1px solid $orange;
  }
  &.dark {
    color: $white;
    background: var(--primary-color);
  }
  &.disable {
    opacity: 0.6;
    cursor: no-drop;
  }
  &.slim {
    padding: 8px 8px;
  }
}
</style>
