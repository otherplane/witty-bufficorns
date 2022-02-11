import NodeCache from 'node-cache'

const WEATHER_KEY = 'weather'
const WEATHER_CACHE_TTL = 3600 // 1 hour, library need to be in seconds
const CACHE_RANCH_KEY = 'ranch'
const CACHE_BUFFICORN_KEY = 'bufficorn'
const CACHE_PLAYER_KEY = 'player'

export class Cache {
  cache: NodeCache

  constructor() {
    this.cache = new NodeCache()
  }

  public get(key: string): any {
    return this.cache.has(key) ? this.cache.get(key) : null
  }

  setWeather(ranchId: number, value: any) {
    return this.cache.set(getWeatherKey(ranchId), value, WEATHER_CACHE_TTL)
  }

  getWeather(ranchId: number) {
    return this.get(getWeatherKey(ranchId))
  }

  getTop3SortedRanches() {
    return this.get(CACHE_RANCH_KEY)
  }

  setTop3SortedRanches(value: any) {
    return this.cache.set(CACHE_RANCH_KEY, value)
  }

  getAllSortedPlayers() {
    return this.get(CACHE_PLAYER_KEY)
  }

  setAllSortedPlayer(value: any) {
    return this.cache.set(CACHE_PLAYER_KEY, value)
  }

  getTop3SortedBufficorns() {
    return this.get(CACHE_BUFFICORN_KEY)
  }

  setTop3SortedBufficorns(value: any) {
    return this.cache.set(CACHE_BUFFICORN_KEY, value)
  }
}

function getWeatherKey(ranchId: number) {
  return `${WEATHER_KEY}-${ranchId}`
}
