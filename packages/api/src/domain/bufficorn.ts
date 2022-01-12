import { BufficornVTO, RanchName, Stats } from '../types'
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
}
