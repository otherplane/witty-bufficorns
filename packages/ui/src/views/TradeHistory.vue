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
          <span class="trade-label">From:</span>
          <span :class="{ self: player.username === trade.from }">{{
            trade.from
          }}</span>
        </p>
        <p>
          <span class="trade-label">To:</span>
          <span :class="{ self: player.username === trade.to }">{{
            trade.to
          }}</span>
        </p>
        <p>
          <span class="trade-label">Resource:</span> {{ trade.resource.trait }}
        </p>
        <p>
          <span class="trade-label">Amount:</span> {{ trade.resource.amount }}
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
  background: $opacity-beige;
  padding: 8px;
  border-radius: 4px;
}
.trade-container {
  display: grid;
  grid-template-rows: repeat(5, max-content);
}
.trade-label {
  color: $brown;
  font-weight: bold;
}
.self {
  color: $brown;
  font-weight: bold;
}
.date {
  font-size: 24px;
}
</style>
