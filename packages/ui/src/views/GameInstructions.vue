<template>
  <MainLayout>
    <div class="container">
      <SectionHeader title="INSTRUCTIONS" />
      <p>Instructions text</p>
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
      player.getTheme()
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
