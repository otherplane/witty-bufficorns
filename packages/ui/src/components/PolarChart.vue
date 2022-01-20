<template>
  <div v-html="svg" ref="chart" class="chart"></div>
</template>

<script>
import radar from 'svg-radar-chart'
import stringify from 'virtual-dom-stringify'
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
        size: 130,
        axes: true,
        captionProps: () => ({
          className: 'caption',
          textAnchor: 'middle',
          fontSize: 10,
          fontFamily: 'sans-serif'
        })
      }
    )

    const svg = `
    <svg version="1" xmlns="http://www.w3.org/2000/svg" viewBox="-10 -10 150 150">
      <style>
        .axis {
          stroke-width: .2;
          stroke: black;
        }
        .scale {
          stroke-width: .2;
          stroke: black;
        }
        .shape {
          stroke-width: .2;
          stroke: #bd3800;
          fill: #bd3800;
          fill-opacity: .3;
        }
        .shape:hover {
          fill-opacity: .6;
        }
      </style>
      ${stringify(chart)}
    </svg>
    `
    return { svg }
  }
}
</script>

<style lang="scss" scoped>
.chart {
  width: 130px;
  height: 130px;
}
.axis {
  stroke-width: 0.2;
  stroke: $brown;
}
.scale {
  stroke-width: 0.2;
  stroke: $brown;
  fill: $brown;
}
.shape {
  fill-opacity: 0.3;
}
.shape:hover {
  fill-opacity: 0.6;
}
</style>
