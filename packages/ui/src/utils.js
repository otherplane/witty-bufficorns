export function getStatsFromAttributes (bufficornAttributes) {
  return Object.entries(bufficornAttributes).map(bufficorn => ({
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
    return Object.entries(stats).reduce(
      (acc, [key, value]) => ({ ...acc, [key]: value / finalResult }),
      []
    )
  } else {
    return {
      vigor: 0,
      stamina: 0,
      speed: 0,
      agility: 0,
      coat: 0,
      coolness: 0
    }
  }
}

function calculateHightestNumber (list) {
  return Math.max(...Object.values(list).filter(Number.isFinite))
}

export function getAssetPath (name) {
  return `../src/assets/${name}.svg`
}
