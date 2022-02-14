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
    coat: 0,
    coolness: 0,
    intelligence: 0,
    speed: 0,
    stamina: 0,
    vigor: 0,
  }
  public medals: Array<string> = []
  public name
  public ranch: RanchName
  public creationIndex: number

  constructor(vto?: BufficornVTO, index?: number) {
    if (vto) {
      this.name = vto.name
      this.medals = vto.medals
      this.stats = {
        coat: vto.coat,
        coolness: vto.coolness,
        intelligence: vto.intelligence,
        speed: vto.speed,
        stamina: vto.stamina,
        vigor: vto.vigor,
      }
      this.ranch = vto.ranch
      this.creationIndex = vto.creationIndex
    } else {
      const idx = index || 0

      this.name = Bufficorn.getBufficornName(idx)
      this.ranch = getRanchFromIndex(idx)
      // number from 0 to 23
      this.creationIndex = idx
    }
  }

  toVTO(): BufficornVTO {
    return {
      name: this.name,
      ranch: this.ranch,
      medals: this.medals,
      creationIndex: this.creationIndex,
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
      .sort(
        (a, b) =>
          // sort by creation index if the bufficorns are tied
          b.calculateScore(trait) - a.calculateScore(trait) ||
          a.creationIndex - b.creationIndex
      )
      .map((b, index) => ({
        name: b.name,
        ranch: b.ranch,
        ...b.stats,
        score: b.calculateScore(trait),
        position: index,
        creationIndex: b.creationIndex,
      }))
  }

  static top3(
    bufficorns: Array<Bufficorn>,
    trait?: Trait
  ): Array<BufficornLeaderboardInfo> {
    return Bufficorn.getLeaderboard(bufficorns, trait).splice(0, 3)
  }

  static getBufficornName(index: number): BufficornName {
    if (index < 0 || index > 23) {
      throw new Error('Invalid index')
    }

    return BUFFICORN_INDEX[index]
  }

  getWorstTrait(): Trait {
    const entries: Array<[Trait, number]> = Object.entries(this.stats) as Array<
      [Trait, number]
    >

    const [worstTrait, _] = entries.reduce((worstEntry, entry) =>
      worstEntry[1] > entry[1] ? entry : worstEntry
    )

    return worstTrait
  }
}
