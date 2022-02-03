import { Bufficorn } from '../src/domain/bufficorn'
import { BufficornLeaderboardInfo } from '../src/types'

export function auxBufficorn(index: number, stats: Array<number>): Bufficorn {
  const b = new Bufficorn(undefined, index)
  b.stats = {
    coat: stats[0],
    coolness: stats[1],
    intelligence: stats[2],
    speed: stats[3],
    stamina: stats[4],
    vigor: stats[5],
  }

  return b
}

export function auxBufficornInfo(
  b: Bufficorn,
  position: number,
  score: number
): BufficornLeaderboardInfo {
  return {
    name: b.name,
    ranch: b.ranch,
    ...b.stats,
    position,
    score,
    creationIndex: b.creationIndex,
  }
}
