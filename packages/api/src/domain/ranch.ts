import {
  BUFFICORNS_INDEX_GROUP_BY_RANCH,
  INDEX_TO_RANCH,
  TRAIT_BY_RANCH,
} from '../constants'
import {
  RanchName,
  Trait,
  DbRanchVTO,
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
      const ranchName = INDEX_TO_RANCH[idx]

      this.name = ranchName
      this.trait = TRAIT_BY_RANCH[ranchName]
      this.medals = []
    }

    if (bufficorns) {
      // Throw an error if they don't belong to the current ranch
      Ranch.checkIfBufficornsBelongToRanch(
        bufficorns.map((b) => b.index),
        this.name
      )

      this.bufficorns = bufficorns
    }
  }

  public addBufficorns(bufficorns: Array<Bufficorn>): void {
    if (bufficorns.length !== 4) {
      console.error('You must provide 4 bufficorns')
    }

    // Throw an error if they don't belong to the current ranch
    Ranch.checkIfBufficornsBelongToRanch(
      bufficorns.map((b) => b.index),
      this.name
    )

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

  // Throw an error if they don't belong to the current ranch
  static checkIfBufficornsBelongToRanch(
    bufficornsIndex: Array<number>,
    ranchName: RanchName
  ) {
    bufficornsIndex.forEach((index) => {
      if (!BUFFICORNS_INDEX_GROUP_BY_RANCH[ranchName].includes(index)) {
        throw new Error(
          `Bufficorn with index ${index} doesn't belong to ranch ${ranchName}`
        )
      }
    })
  }
}
