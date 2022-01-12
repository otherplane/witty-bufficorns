<template>
  <div class="players-container" :class="{ even: index % 2 }">
    <p class="item player-name">{{ position }}</p>
    <p class="item player-name">{{ name }}</p>
    <p class="item player-score">{{ score }}</p>
  </div>
</template>

<script>
export default {
  props: {
    index: Number,
    name: String,
    score: Number,
    position: Number
  }
}
</script>

<style scoped lang="scss">
.even {
  background: $opacity-beige;
  border-radius: 4px;
}
.players-container {
  display: grid;
  grid-template-columns: max-content max-content 1fr;
  row-gap: 16px;
  column-gap: 16px;
  padding: 16px;

  .player-name {
    color: $brown;
    font-weight: bold;
    justify-self: flex-start;
  }
  .player-score {
    justify-self: flex-end;
  }
}
</style>
