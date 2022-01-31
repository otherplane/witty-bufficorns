<template>
  <div class="counter">
    <transition name="fade">
      <div v-if="player.tradeOut" class="left">
        <p class="label">
          Sending
          <span class="highlight">{{
            player.tradeOut?.resource?.amount || 0
          }}</span>
          points of
          <span class="highlight">{{
            player.tradeOut?.resource?.trait.toUpperCase() || ''
          }}</span>
          to
          <span class="highlight">{{
            player.tradeOut?.to.toUpperCase() || ''
          }}</span>
        </p>
        <div class="time-container">
          <TimeLeft
            class="time-left"
            :timestamp="player.tradeOut.ends"
            :seconds="true"
            @clear-timestamp="player.tradeOut = null"
          />
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div v-if="player.tradeIn" class="right">
        <p class="label">
          Receiving
          <span class="highlight">{{
            player.tradeIn?.resource?.amount || 'null'
          }}</span>
          points of
          <span class="highlight">{{
            player.tradeIn?.resource?.trait.toUpperCase() || 'null'
          }}</span>
          from
          <span class="highlight">{{
            player.tradeIn?.to.toUpperCase() || 'null'
          }}</span>
        </p>
        <div class="time-container">
          <TimeLeft
            class="time-left"
            :timestamp="player.tradeIn.ends"
            :seconds="true"
            @clear-timestamp="player.tradeIn = null"
          />
        </div>
      </div>
    </transition>
    <div></div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from '@/stores/player'
export default {
  setup (props) {
    const player = useStore()
    const show = ref(false)
    return { player, show }
  }
}
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
  opacity: 0;
}
.fade-enter-to {
  opacity: 1;
}
.fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.counter {
  margin-bottom: 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 16px;
  text-align: center;
  grid-template-rows: max-content;
  .time-container {
    width: 100%;
    background-color: var(--primary-color-opacity-2);
    color: var(--primary-color);
    font-weight: 600;
    padding: 0px 8px;
    border-radius: 4px;
    text-align: left;
  }
  .left {
    grid-column: 1;
  }
  .right {
    grid-column: 2;
  }
  .label {
    text-align: left;
    margin-bottom: 8px;
    color: var(--primary-color);
    font-weight: bold;
    font-size: 12px;
    .highlight {
      color: var(--primary-color);
    }
  }
  .time-left {
    width: max-content;
    overflow: hidden;
    text-align: left;
    font-size: 18px;
  }
}
.carousel {
  border-radius: 4px;
  border: 1px solid var(--primary-color);
  .label {
    font-weight: bold;
  }
}
.carousel-open:checked + .carousel-item {
  position: static;
  opacity: 100;
}

.carousel-item {
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto auto;
  align-items: center;
  text-align: center;
  padding: 8px;
  justify-content: center;
}

#carousel-1:checked ~ .control-1,
#carousel-2:checked ~ .control-2,
#carousel-3:checked ~ .control-3 {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
