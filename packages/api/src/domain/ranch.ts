import {
  RanchName,
  Trait,
  DbRanchVTO,
  indexToRanch,
  ranchToTrait,
  RanchVTO,
  RanchLeaderboardInfo,
} from '../types'
import { Bufficorn } from './bufficorn'

export class Ranch {
  public name: RanchName
  public trait: Trait
  public medals: Array<string>
  public bufficorns: Array<Bufficorn> = []

  constructor(vto?: DbRanchVTO, index?: number, bufficorns?: Array<Bufficorn>) {
    if (vto) {
      this.name = vto.name
      this.trait = vto.trait
      this.medals = vto.medals
    } else {
      const idx = index || 0
      const ranchName = indexToRanch[idx]

      this.name = ranchName
      this.trait = ranchToTrait[ranchName]
      this.medals = []
    }

    if (bufficorns) {
      this.bufficorns = bufficorns
    }
  }

  public addBufficorns(bufficorns: Array<Bufficorn>): void {
    if (bufficorns.length !== 4) {
      console.error('You must provide 4 bufficorns')
    }
    this.bufficorns = bufficorns
  }

  public toVTO(): RanchVTO {
    return {
      name: this.name,
      bufficorns: this.bufficorns.map((bufficorn) => bufficorn.toVTO()),
      medals: this.medals,
      trait: this.trait,
    }
  }

  public toDbVTO(): DbRanchVTO {
    return {
      name: this.name,
      bufficorns: this.bufficorns.map((bufficorn) => bufficorn.name),
      medals: this.medals,
      trait: this.trait,
    }
  }

  calculateScore(trait?: Trait) {
    const bufficorn_scores = this.bufficorns.map((b: Bufficorn) =>
      b.calculateScore(trait)
    )

    return trait ? Math.max(...bufficorn_scores) : Math.min(...bufficorn_scores)
  }

  static getLeaderboard(
    bufficorns: Array<Ranch>,
    trait?: Trait
  ): Array<RanchLeaderboardInfo> {
    return bufficorns
      .sort((a, b) => b.calculateScore(trait) - a.calculateScore(trait))
      .map((r, index) => ({
        name: r.name,
        score: r.calculateScore(trait),
        position: index,
      }))
  }
}
