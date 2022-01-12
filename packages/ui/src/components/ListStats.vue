<template>
  <div>
    <div v-if="gameEntity === 'bufficorns'">
      <BufficornGlobalData
        v-for="(bufficorn, index) in sortedBufficornsData"
        :index="index"
        :key="bufficorn.name"
        :name="bufficorn.name"
        :attributes="{
          vigor: bufficorn.vigor,
          agility: bufficorn.agility,
          speed: bufficorn.speed,
          coolness: bufficorn.coolness
        }"
      />
    </div>
    <div v-if="gameEntity === 'players'">
      <PlayerGlobalData
        v-for="(player, index) in sortedPlayersData"
        :index="index"
        :key="player.username"
        :name="player.username"
        :position="player.position"
        :score="player.points"
      />
    </div>
    <div v-if="gameEntity === 'ranches'">
      <RancheGlobalData
        v-for="(ranch, index) in sortedRanchesData"
        :index="index"
        :key="ranch.name"
        :score="ranch.score"
        :name="ranch.name"
      />
    </div>
  </div>
</template>

<script>
import { useStore } from '@/stores/player'
import { computed, onBeforeMount, nextTick } from 'vue'
export default {
  props: {
    gameEntity: {
      type: String,
      required: true
    },
    entityAttribute: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const player = useStore()
    onBeforeMount(async () => {
      await player.getGlobalStats()
    })
    function filterListByLabel ({ list, label }) {
      return list.sort((e1, e2) => {
        return e2[label] - e1[label]
      })
    }
    const sortedBufficornsData = computed(() =>
      filterListByLabel({
        list: player.bufficornsGlobalStats || [],
        label: props.entityAttribute
      })
    )
    const sortedPlayersData = computed(() =>
      filterListByLabel({
        list: player.playersGlobalStats || [],
        label: props.entityAttribute
      })
    )
    const sortedRanchesData = computed(() =>
      filterListByLabel({
        list: player.ranchesGlobalStats || [],
        label: props.entityAttribute
      })
    )
    return { sortedBufficornsData, sortedPlayersData, sortedRanchesData }
  }
}
</script>

<style lang="scss" scoped>
.list-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-gap: 40px;
}
@media (max-width: 600px) {
  .list-container {
    grid-template-columns: 1fr;
  }
}
</style>
