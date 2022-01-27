import {
  BufficornLeaderboardInfo,
  BufficornName,
  BufficornVTO,
  RanchName,
  Stats,
  Trait,
} from '../types'
import { getRanchFromIndex } from '../utils'
import { BUFFICORN_INDEX } from '../constants'

export class Bufficorn {
  public stats: Stats = {
    agility: 0,
    coat: 0,
    coolness: 0,
    speed: 0,
    stamina: 0,
    vigor: 0,
  }
  public medals: Array<string> = []
  public name
  public ranch: RanchName
  public index: number

  constructor(vto?: BufficornVTO, index?: number) {
    if (vto) {
      this.name = vto.name
      this.medals = vto.medals
      this.stats = {
        agility: vto.agility,
        coat: vto.agility,
        coolness: vto.coolness,
        speed: vto.speed,
        stamina: vto.stamina,
        vigor: vto.vigor,
      }
      this.ranch = vto.ranch
      this.index = vto.index
    } else {
      const idx = index || 0

      this.name = Bufficorn.getBufficornName(idx)
      this.ranch = getRanchFromIndex(idx)
      // number from 0 to 23
      this.index = idx
    }
  }

  toVTO(): BufficornVTO {
    return {
      name: this.name,
      ranch: this.ranch,
      medals: this.medals,
      index: this.index,
      ...this.stats,
    }
  }

  calculateScore(trait?: Trait) {
    return trait ? this.stats[trait] : Math.min(...Object.values(this.stats))
  }

  static getLeaderboard(
    bufficorns: Array<Bufficorn>,
    trait?: Trait
  ): Array<BufficornLeaderboardInfo> {
    return bufficorns
      .sort((a, b) => b.calculateScore(trait) - a.calculateScore(trait))
      .map((b, index) => ({
        name: b.name,
        ranch: b.ranch,
        ...b.stats,
        score: b.calculateScore(trait),
        position: index,
        index: b.index,
      }))
  }

  static getBufficornName(index: number): BufficornName {
    if (index < 0 || index > 23) {
      throw new Error('Invalid index')
    }

    return BUFFICORN_INDEX[index]
  }
}
