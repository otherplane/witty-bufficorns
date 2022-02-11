import { ATTRIBUTES, PLAYER_MAINNET_TIMESTAMP } from '@/constants.js'
export function getStatsFromAttributes (bufficornAttributes) {
  return Object.entries(bufficornAttributes).map(bufficorn => ({
    ...ATTRIBUTES[bufficorn[0]],
    key: bufficorn[0],
    score: bufficorn[1]
  }))
}

export function normalizedChartData (stats, bufficornsArray) {
  if (bufficornsArray) {
    const result = bufficornsArray.map(bufficorn => {
      return calculateHightestNumber(bufficorn)
    })
    const finalResult = calculateHightestNumber(result)
    // Added minimun area of 0.05 to improve polar graph UI
    return Object.entries(stats).reduce(
      (acc, [key, value]) => ({ ...acc, [key]: value / finalResult + 0.05 }),
      []
    )
  } else {
    return {
      coat: 0.1,
      coolness: 0.1,
      intelligence: 0.1,
      speed: 0.1,
      stamina: 0.1,
      vigor: 0.1
    }
  }
}

function calculateHightestNumber (list) {
  // Added minimun area of 0.05 to improve polar graph UI
  return Math.max(...Object.values(list).filter(Number.isFinite)) - 0.05
}

export function formatNumber (num) {
  num += ''
  const splitedNumber = num.split('.')
  const decimals = splitedNumber.length > 1 ? '.' + splitedNumber[1] : ''
  const rgx = /(\d)(?=(\d{3})+(?!\d))/g
  const unit = splitedNumber[0].replace(rgx, '$1,')
  return unit + decimals
}

export function isMainnetTime () {
  return Date.now() >= PLAYER_MAINNET_TIMESTAMP * 1000
}
