import { DbTradeVTO, Trait } from '../types'

export class Trade {
  public bufficorn: string
  public from: string
  public to: string
  public resource: {
    trait: Trait
    amount: number
  }
  public timestamp: number
  public ends: number

  constructor(vto: DbTradeVTO) {
    this.bufficorn = vto.bufficorn
    this.bufficorn = vto.bufficorn
    this.from = vto.from
    this.to = vto.to
    this.resource = vto.resource
    this.timestamp = vto.timestamp
    this.ends = vto.ends
  }

  toVTO(): DbTradeVTO {
    return {
      bufficorn: this.bufficorn,
      from: this.from,
      to: this.to,
      resource: this.resource,
      timestamp: this.timestamp,
      ends: this.ends,
    }
  }
}
