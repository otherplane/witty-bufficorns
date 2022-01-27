<template>
  <MainLayout>
    <div class="container">
      <SectionHeader title="TRADE HISTORY" />
      <div
        v-for="(trade, index) in player.tradeHistory"
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
    </div>
  </MainLayout>
</template>

<script>
import { useStore } from '@/stores/player'
import { onMounted, computed } from 'vue'
import { format } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'

export default {
  setup () {
    const player = useStore()
    onMounted(() => {
      player.getTradeHistory()
    })
    const timeZone = 'America/Denver'
    return { player, utcToZonedTime, timeZone, format }
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
