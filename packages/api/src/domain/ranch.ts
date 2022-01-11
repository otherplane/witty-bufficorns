import {
  RanchName,
  Trait,
  DbRanchVTO,
  indexToRanch,
  ranchToTrait,
  RanchVTO,
} from '../types'
import { Bufficorn } from './bufficorn'

export class Ranch {
  public name: RanchName
  public trait: Trait
  public medals: Array<string>
  public bufficorns: Array<Bufficorn> = []

  constructor(vto?: DbRanchVTO, index?: number) {
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

  static getLeaderboard(ranches: Array<Ranch>): Array<Ranch> {
    return ranches
  }
}
