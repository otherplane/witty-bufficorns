import stringify from 'virtual-dom-stringify'
import agilityRaw from '@/assets/agility.svg?raw'

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
    <g transform="translate(${70},${-30})">
    ${agilityRaw}
    </g>
    <g transform="translate(${155},${18})">
    ${agilityRaw}
    </g>
    <g transform="translate(${155},${110})">
    ${agilityRaw}
    </g>
    <g transform="translate(${75},${160})">
    ${agilityRaw}
    </g>
    <g transform="translate(${-10},${115})">
    ${agilityRaw}
    </g>
    <g transform="translate(${-10},${15})">
    ${agilityRaw}
    </g>
  </svg>
  `
}
