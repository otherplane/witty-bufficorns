<template>
  <div>
    <div v-if="gameEntity === 'bufficorns'" class="list">
      <BufficornData
        v-for="(bufficorn, index) in sortedBufficornsData"
        :bufficorn-list="sortedBufficornsData"
        :index="bufficorn.creationIndex"
        :key="bufficorn.name"
        :name="bufficorn.name"
        :background-front="!!(index % 2)"
        :background-back="!(index % 2)"
        :attributes="{
          vigor: bufficorn.vigor,
          agility: bufficorn.agility,
          speed: bufficorn.speed,
          coolness: bufficorn.coolness,
          coat: bufficorn.coat,
          stamina: bufficorn.stamina
        }"
        :horizontal="true"
      />
    </div>
    <div v-if="gameEntity === 'players'" class="list">
      <PlayerGlobalData
        v-for="(player, index) in sortedPlayersData"
        :class="{ even: index % 2 }"
        :index="index"
        :key="player.username"
        :name="player.username"
        :position="player.position + 1"
        :score="player.points"
      />
      <CustomPagination :limit="10" @update-page="updateCurrentPage" />
    </div>
    <div v-if="gameEntity === 'ranches'" class="list">
      <RancheGlobalData
        v-for="(ranch, index) in sortedRanchesData"
        :class="{ even: index % 2 }"
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
import { computed, onBeforeMount, nextTick, ref, watch } from 'vue'
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
    // paginate data
    const currentPage = ref(0)
    const limit = ref(25)
    const offset = computed(() => {
      return limit.value * currentPage.value
    })
    onBeforeMount(async () => {
      await player.getGlobalStats()
    })
    watch(currentPage, async () => {
      await player.getGlobalStats(offset.value, limit.value)
    })
    function updateCurrentPage (page) {
      console.log('updated---', page)
      currentPage.value = page
    }
    // filter list by attribute
    function filterListByLabel ({ list, label }) {
      const filter = label === 'overall' ? 'score' : label
      const result = list.sort((e1, e2) => {
        return e2[filter] - e1[filter]
      })
      return result
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
    return {
      sortedBufficornsData,
      sortedPlayersData,
      sortedRanchesData,
      updateCurrentPage
    }
  }
}
</script>

<style lang="scss" scoped>
.even {
  background: var(--primary-color-opacity-2);
  border-radius: 4px;
}
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
