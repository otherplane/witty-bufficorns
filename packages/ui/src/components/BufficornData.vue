<template>
  <div class="bufficorn-list-container" :class="{ horizontal }">
    <div v-if="selectable" class="name-container">
      <p class="name">{{ name }}</p>
      <div class="pointer" @click="player.updateSelectedBufficorn(index)">
        <svg
          width="26"
          height="25"
          viewBox="0 0 46 45"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            :class="{ fill: player.selectedBufficorn === index }"
            d="M23 10L25.9187 18.6373H35.3637L27.7225 23.9754L30.6412 32.6127L23 27.2746L15.3588 32.6127L18.2775 23.9754L10.6363 18.6373H20.0813L23 10Z"
            fill="transparent"
          />
          <path
            d="M23 3.1725L27.2148 15.8623L27.4422 16.5471H28.1638H41.7412L30.7759 24.3407L30.1731 24.7691L30.4062 25.471L34.6063 38.1166L23.5793 30.2791L23 29.8674L22.4207 30.2791L11.3937 38.1166L15.5938 25.471L15.8269 24.7691L15.2241 24.3407L4.25881 16.5471H17.8362H18.5578L18.7852 15.8623L23 3.1725Z"
            stroke="black"
            stroke-width="2"
          />
        </svg>
      </div>
    </div>
    <p v-else class="position">{{ index + 1 }}</p>
    <FlipCard
      :index="index"
      :key="name"
      :name="!selectable ? name : null"
      :background-front="backgroundFront"
      :background-back="backgroundBack"
      :selected="player.selectedBufficorn === index"
      :attributes="{
        coat: attributes.coat,
        coolness: attributes.coolness,
        intelligence: attributes.intelligence,
        speed: attributes.speed,
        stamina: attributes.stamina,
        vigor: attributes.vigor
      }"
      :horizontal="horizontal"
    />
  </div>
</template>

<script>
import { useStore } from '@/stores/player'

export default {
  props: {
    index: Number,
    attributes: {
      coat: Number,
      coolness: Number,
      intelligence: Number,
      speed: Number,
      stamina: Number,
      vigor: Number
    },
    name: String,
    horizontal: {
      type: Boolean,
      default: false
    },
    selectable: {
      type: Boolean,
      default: false
    },
    backgroundFront: {
      type: Boolean,
      default: false
    },
    backgroundBack: {
      type: Boolean,
      default: false
    }
  },
  setup (props) {
    const player = useStore()
    return { player }
  }
}
</script>

<style scoped lang="scss">
.bufficorn-list-container {
  margin-bottom: 16px;
  grid-gap: 8px;
  display: grid;
  justify-items: center;
  grid-template-columns: 1fr;
  align-items: center;
  &.horizontal {
    grid-template-columns: max-content max-content;
    justify-content: center;
    align-items: center;
    column-gap: 16px;
    .position {
      color: var(--primary-color);
      font-weight: bold;
      justify-self: flex-start;
    }
  }
  .name-container {
    display: grid;
    width: 100%;
    padding: 0px 8px;
    grid-template-columns: 1fr max-content;
    .fill {
      fill: var(--primary-color);
    }
    .name {
      color: var(--primary-color);
      font-weight: bold;
    }
    .pointer {
      width: 25px;
      cursor: pointer;
    }
  }
}
</style>
