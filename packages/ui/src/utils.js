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
      (acc, [key, value]) => ({ ...acc, [key]: value / finalResult + 0.05 }),
      []
    )
  } else {
    return {
      vigor: 0.1,
      stamina: 0.1,
      speed: 0.1,
      agility: 0.1,
      coat: 0.1,
      coolness: 0.1
    }
  }
}

function calculateHightestNumber (list) {
  return Math.max(...Object.values(list).filter(Number.isFinite)) - 0.05
}

export function getAssetPath (name) {
  return `../src/assets/${name}.svg`
}
