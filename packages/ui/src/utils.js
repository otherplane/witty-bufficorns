export function getStatsFromAttributes (bufficornAttributes) {
  return Object.entries(bufficornAttributes).map(bufficorn => ({
    key: bufficorn[0],
    score: bufficorn[1]
  }))
}

export function normalizedChartData (stats, bufficornsArray) {
  const result = bufficornsArray.map(bufficorn => {
    return calculateHightestNumber(bufficorn)
  })
  const finalResult = calculateHightestNumber(result)
  const normalizedData = {}
  Object.entries(stats).map(entry => {
    normalizedData[entry[0]] = entry[1] / finalResult
  })
  return normalizedData
}

function calculateHightestNumber (list) {
  return Object.values(list).reduce((prev, cur, index, array) => {
    if (typeof prev !== 'number') {
      return cur
    } else {
      return prev > cur ? prev : cur
    }
  })
}

export function getAssetPath (name) {
  return `../src/assets/${name}.svg`
}
