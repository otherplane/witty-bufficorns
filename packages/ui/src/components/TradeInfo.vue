<template>
  <div class="counter">
    <transition name="fade">
      <div v-if="player.tradeInfo && player.tradeOut" class="left">
        <p class="label">TIME LEFT TO SEND</p>
        <div class="time-container">
          <TimeLeft
            class="time-left"
            :timestamp="player.tradeOut.timestamp"
            :seconds="true"
            @clear-timestamp="clearTimestamp"
          />
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div v-if="player.tradeInfo && player.tradeIn.timestamp" class="right">
        <p class="label">TIME LEFT TO RECEIVE</p>
        <div class="time-container">
          <TimeLeft
            class="time-left"
            :timestamp="123455"
            :seconds="true"
            @clear-timestamp="clearTimestamp"
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
    const clearTimestamp = () => {
      player.tradeInfo = null
    }
    const show = ref(false)
    return { player, clearTimestamp, show }
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 16px;
  text-align: center;
  grid-template-rows: max-content;
  .time-container {
    width: 100%;
    background-color: $opacity-pink;
    color: $brown;
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
    font-weight: bold;
    margin-bottom: 8px;
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
  border: 1px solid $brown;
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
