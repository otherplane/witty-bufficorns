import NodeCache from 'node-cache'
import { Prize, Trait } from './types'

const WEATHER_KEY = 'weather'
const WEATHER_CACHE_TTL = 3600 // 1 hour, library need to be in seconds
const CACHE_RANCH_KEY = 'ranch'
const CACHE_BUFFICORN_KEY = 'bufficorn'
const CACHE_BUFFICORN_COAT_KEY = 'bufficornCoat'
const CACHE_BUFFICORN_COOLNESS_KEY = 'bufficornCoolness'
const CACHE_BUFFICORN_INTELLIGENCE_KEY = 'bufficornIntelligence'
const CACHE_BUFFICORN_SPEED_KEY = 'bufficornSpeed'
const CACHE_BUFFICORN_STAMINA_KEY = 'bufficornStamina'
const CACHE_BUFFICORN_VIGOR_KEY = 'bufficornVigor'
const CACHE_PLAYER_KEY = 'player'

export class Cache {
  cache: NodeCache

  constructor() {
    this.cache = new NodeCache()
  }

  public get(key: string): any {
    return this.cache.has(key) ? this.cache.get(key) : null
  }

  setTokenIdToSVGName(tokenId: string, svgName: Prize, ranking: string) {
    return this.cache.set(`token-id-${tokenId}`, { tokenId, svgName, ranking })
  }

  getTokenIdToSVGName(tokenId: string): {
    tokenId: string
    svgName: Prize
    ranking: string
  } {
    return this.cache.get(`token-id-${tokenId}`) as {
      tokenId: string
      svgName: Prize
      ranking: string
    }
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

  getTop3SortedBufficorns(trait?: Trait) {
    switch (trait) {
      case Trait.Coat:
        return this.get(CACHE_BUFFICORN_COAT_KEY)
      case Trait.Coolness:
        return this.get(CACHE_BUFFICORN_COOLNESS_KEY)
      case Trait.Intelligence:
        return this.get(CACHE_BUFFICORN_INTELLIGENCE_KEY)
      case Trait.Speed:
        return this.get(CACHE_BUFFICORN_SPEED_KEY)
      case Trait.Stamina:
        return this.get(CACHE_BUFFICORN_STAMINA_KEY)
      case Trait.Vigor:
        return this.get(CACHE_BUFFICORN_VIGOR_KEY)
      case undefined:
        return this.get(CACHE_BUFFICORN_KEY)
    }
  }

  setTop3SortedBufficorns(value: any, trait?: Trait) {
    switch (trait) {
      case Trait.Coat:
        return this.cache.set(CACHE_BUFFICORN_COAT_KEY, value)
      case Trait.Coolness:
        return this.cache.set(CACHE_BUFFICORN_COOLNESS_KEY, value)
      case Trait.Intelligence:
        return this.cache.set(CACHE_BUFFICORN_INTELLIGENCE_KEY, value)
      case Trait.Speed:
        return this.cache.set(CACHE_BUFFICORN_SPEED_KEY, value)
      case Trait.Stamina:
        return this.cache.set(CACHE_BUFFICORN_STAMINA_KEY, value)
      case Trait.Vigor:
        return this.cache.set(CACHE_BUFFICORN_VIGOR_KEY, value)
      case undefined:
        return this.cache.set(CACHE_BUFFICORN_KEY, value)
    }
  }
}

function getWeatherKey(ranchId: number) {
  return `${WEATHER_KEY}-${ranchId}`
}
