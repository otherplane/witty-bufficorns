import { Bufficorn } from '../../../src/domain/bufficorn'
import { Ranch } from '../../../src/domain/ranch'
import { RanchLeaderboardInfo } from '../../../src/types'

describe('ranch.ts', () => {
  function auxBufficorn(index: number, stats: Array<number>): Bufficorn {
    const b = new Bufficorn(undefined, index)
    b.stats = {
      vigor: stats[0],
      agility: stats[1],
      coat: stats[2],
      coolness: stats[3],
      speed: stats[4],
      stamina: stats[5],
    }

    return b
  }

  it('calculateScore', async () => {
    const bufficorn_0 = auxBufficorn(0, [10, 20, 30, 40, 50, 60])
    const bufficorn_1 = auxBufficorn(6, [21, 31, 41, 51, 61, 11])
    const bufficorn_2 = auxBufficorn(12, [32, 42, 52, 62, 12, 22])
    const bufficorn_3 = auxBufficorn(18, [43, 53, 63, 13, 23, 33])

    const ranch = new Ranch(undefined, 0, [
      bufficorn_0,
      bufficorn_1,
      bufficorn_2,
      bufficorn_3,
    ])

    expect(ranch.calculateScore()).toStrictEqual(10)
  })

  function auxRanchInfo(
    r: Ranch,
    position: number,
    score: number
  ): RanchLeaderboardInfo {
    return {
      name: r.name,
      score,
      position,
    }
  }

  it('getLeaderboard', async () => {
    const bufficorn_0 = auxBufficorn(0, [10, 20, 30, 40, 50, 60])
    const bufficorn_1 = auxBufficorn(1, [21, 31, 41, 51, 61, 11])
    const bufficorn_2 = auxBufficorn(2, [32, 42, 52, 62, 12, 22])

    const ranch_0 = new Ranch(undefined, 0, [bufficorn_0])
    const ranch_1 = new Ranch(undefined, 1, [bufficorn_1])
    const ranch_2 = new Ranch(undefined, 2, [bufficorn_2])

    const sortedRanches = Ranch.getLeaderboard([ranch_0, ranch_1, ranch_2])

    const expected_0 = auxRanchInfo(ranch_0, 2, 10)
    const expected_1 = auxRanchInfo(ranch_1, 1, 11)
    const expected_2 = auxRanchInfo(ranch_2, 0, 12)

    expect(sortedRanches).toStrictEqual([expected_2, expected_1, expected_0])
  })
})
