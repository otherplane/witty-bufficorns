import {
  BufficornLeaderboardInfo,
  BufficornVTO,
  RanchName,
  Stats,
  Trait,
} from '../types'
import { getRanchFromIndex } from '../utils'

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
  public name: string
  public ranch: RanchName

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
    } else {
      const idx = index || 0

      this.name = `Bufficorn-${idx}`
      this.ranch = getRanchFromIndex(idx)
    }
  }

  toVTO(): BufficornVTO {
    return {
      name: this.name,
      ranch: this.ranch,
      medals: this.medals,
      ...this.stats,
    }
  }

  getScore(trait?: Trait) {
    const { vigor, speed, coolness, stamina, coat, agility } = this.stats

    return trait
      ? this.stats[trait]
      : Math.min(vigor, speed, coolness, stamina, coat, agility)
  }

  static getLeaderboard(
    bufficorns: Array<Bufficorn>,
    trait?: Trait
  ): Array<BufficornLeaderboardInfo> {
    return bufficorns
      .sort((a, b) => b.getScore(trait) - a.getScore(trait))
      .map((b, index) => {
        return {
          name: b.name,
          ranch: b.ranch,
          ...b.stats,
          score: b.getScore(trait),
          position: index,
        }
      })
  }
}
