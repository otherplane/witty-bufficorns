<template>
  <MainLayout>
    <div class="container">
      <SectionHeader title="TRADE HISTORY" />
      <div
        v-for="(trade, index) in player.tradeHistory?.trades"
        :key="trade.timestamp"
        class="trade-container"
        :class="{ even: index % 2 }"
      >
        <p class="trade-label date">
          {{
            format(
              utcToZonedTime(trade.timestamp, timeZone),
              'yyyy-MM-dd HH:mm:ss'
            )
          }}
        </p>
        <p>
          <span class="highlight">{{ trade.from }}</span>
          sent <span class="highlight">{{ trade.resource.amount }}</span> points
          of <span class="highlight">{{ trade.resource.trait }}</span> to
          <span class="highlight">{{ trade.to }}</span>
        </p>
      </div>
      <CustomPagination
        v-if="numberPages > 1"
        :limit="numberPages"
        @update-page="updateCurrentPage"
      />
    </div>
  </MainLayout>
</template>

<script>
import { useStore } from '@/stores/player'
import { onMounted, computed, ref, watch } from 'vue'
import { format } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'

export default {
  setup () {
    const player = useStore()
    const timeZone = 'America/Denver'
    onMounted(() => {
      player.getTradeHistory()
    })
    const currentPage = ref(0)
    const limit = ref(25)
    const numberPages = computed(() => {
      return Math.ceil((player.tradeHistory?.total || 0) / limit.value)
    })
    const offset = computed(() => {
      return limit.value * currentPage.value
    })
    watch(currentPage, async () => {
      await player.getTradeHistory(offset.value, limit.value)
    })
    function updateCurrentPage (page) {
      currentPage.value = page
    }
    return {
      player,
      utcToZonedTime,
      timeZone,
      format,
      numberPages,
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
.container {
  row-gap: 0px;
}
.trade-container {
  padding: 16px;
  display: grid;
  grid-template-columns: max-content 1fr;
  grid-template-rows: max-content;
  text-align: left;
}
.trade-label {
  color: var(--primary-color);
  font-weight: bold;
}
.highlight {
  color: var(--primary-color);
  font-weight: 600;
}
.date {
  width: 100px;
  font-size: 218x;
}
</style>
