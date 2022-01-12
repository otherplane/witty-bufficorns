import {
  RanchName,
  Resource,
  DbRanchVTO,
  indexToRanch,
  ranchToTrait,
  RanchVTO,
} from '../types'
import { Bufficorn } from './bufficorn'

export class Ranch {
  public name: RanchName
  public resource: Resource
  public medals: Array<string>
  public bufficorns: Array<Bufficorn> = []

  constructor(vto?: DbRanchVTO, index?: number) {
    if (vto) {
      this.name = vto.name
      this.resource = vto.resource
      this.medals = vto.medals
    } else {
      const idx = index || 0
      const ranchName = indexToRanch[idx]

      this.name = ranchName
      this.resource = { trait: ranchToTrait[ranchName], amount: 800 }
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
      resource: this.resource,
    }
  }

  public toDbVTO(): DbRanchVTO {
    return {
      name: this.name,
      bufficorns: this.bufficorns.map((bufficorn) => bufficorn.name),
      medals: this.medals,
      resource: this.resource,
    }
  }
}
