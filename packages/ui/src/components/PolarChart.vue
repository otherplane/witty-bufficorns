<template>
  <div v-html="svgChart" ref="chart" class="chart"></div>
</template>

<script>
import radar from 'svg-radar-chart'
import { generateSvgChart } from '@/composables/generateSvgChart.js'
import smoothing from 'svg-radar-chart/smoothing'

export default {
  props: {
    stats: {
      vigor: Number,
      stamina: Number,
      speed: Number,
      coat: Number,
      agility: Number,
      coolness: Number
    }
  },
  setup (props) {
    const chart = radar(
      {
        vigor: `Vigor`,
        stamina: `Stamina`,
        speed: `Speed`,
        coolness: `Coolness`,
        coat: `Coat`,
        agility: `Agility`
      },
      [props.stats],
      {
        smoothing: smoothing(1), // tension of .3
        captionsPosition: 1,
        size: 160,
        axes: true,
        captionProps: () => ({
          className: 'caption',
          textAnchor: 'middle',
          fontSize: 10,
          fontFamily: 'Zilla Slab'
        })
      }
    )

    return { svgChart: generateSvgChart(chart) }
  }
}
</script>

<style lang="scss" scoped>
.axis {
  stroke-width: 0.2;
  stroke: var(--primary-color);
}
.scale {
  stroke-width: 0.2;
  stroke: var(--primary-color);
  fill: var(--primary-color);
}
.shape {
  fill-opacity: 0.3;
}
.shape:hover {
  fill-opacity: 0.6;
}
</style>
