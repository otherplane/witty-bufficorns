export function getStatsFromAttributes (bufficornAttributes) {
  return Object.entries(bufficornAttributes).map(bufficorn => ({
    key: bufficorn[0],
    score: bufficorn[1]
  }))
}

export function getAssetPath (name) {
  return `../src/assets/${name}.svg`
}
