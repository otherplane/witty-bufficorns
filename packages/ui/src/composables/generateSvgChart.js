import stringify from 'virtual-dom-stringify'
import vigor from '@/assets/vigor.svg?raw'
import stamina from '@/assets/stamina.svg?raw'
import speed from '@/assets/speed.svg?raw'
import coat from '@/assets/coat.svg?raw'
import intelligence from '@/assets/brain.svg?raw'
import coolness from '@/assets/coolness.svg?raw'

export function extractPath (svg) {
  return svg
    .replace(/<svg[^>]+>/, '<g>')
    .replace(/<\/svg>/, '</g>')
    .replace(/transform=[^>]+/, '')
}

export function generateSvgChart (chart) {
  return `
  <svg version="1" xmlns="http://www.w3.org/2000/svg" viewBox="-20 -20
   200 200">
    <style>
      .axis {
        stroke-width: .2;
        stroke: black;
      }
      .scale {
        stroke-width: .2;
        stroke: black;
      }
      .caption {
        display: none;
      }
      .icon {
        fill: #FFE8FF
      }
      .chart {
        width: 130px;
        height: 150px;
      }
      .shape {
        stroke-width: .2;
        stroke: var(--primary-color);
        fill: var(--primary-color);
        fill-opacity: .6;
      }
      .shape:hover {
        fill-opacity: .6;
      }
    </style>
    ${stringify(chart)}
    <g transform="translate(${32},${-56})">
    ${extractPath(coat)}
    </g>
    <g transform="translate(${98},${-4})">
    ${extractPath(coolness)}
    </g>
    <g transform="translate(${134},${94})">
    ${extractPath(intelligence)}
    </g>
    <g transform="translate(${52},${162})">
    ${extractPath(speed)}
    </g>
    <g transform="translate(${-34},${108})">
    ${extractPath(stamina)}
    </g>
    <g transform="translate(${-42},${14})">
    ${extractPath(vigor)}
    </g>
  </svg>
  `
}
