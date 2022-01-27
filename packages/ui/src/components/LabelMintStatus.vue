<template>
  <div class="mint-status" :class="status">{{ status.toUpperCase() }}</div>
</template>

<script>
export default {
  props: {
    status: String
  }
}
</script>

<style scoped lang="scss">
.mint-status {
  width: min-content;
  font-size: 12px;
  padding: 2px 4px;
  border-radius: 4px;
  font-weight: bold;
  height: min-content;
  color: var(--primary-color);
}
.minted {
  border: 1px solid var(--primary-color);
}
.pending {
  border: 1px solid $orange;
  color: $orange;
}
</style>
