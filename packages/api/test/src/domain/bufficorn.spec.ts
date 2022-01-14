import { Bufficorn } from '../../../src/domain/bufficorn'
import { Trait, BufficornLeaderboardInfo } from '../../../src/types'

describe('bufficorn.ts', () => {
  it('getScore', async () => {
    const bufficorn = new Bufficorn(undefined, 0)
    expect(bufficorn.getScore()).toStrictEqual(0)
    expect(bufficorn.getScore(Trait.Vigor)).toStrictEqual(0)

    bufficorn.stats.vigor = 10
    expect(bufficorn.getScore()).toStrictEqual(0)
    expect(bufficorn.getScore(Trait.Vigor)).toStrictEqual(10)

    bufficorn.stats.agility = 20
    bufficorn.stats.coat = 30
    bufficorn.stats.coolness = 40
    bufficorn.stats.speed = 50
    bufficorn.stats.stamina = 60
    expect(bufficorn.getScore()).toStrictEqual(10)
    expect(bufficorn.getScore(Trait.Vigor)).toStrictEqual(10)
    expect(bufficorn.getScore(Trait.Agility)).toStrictEqual(20)
    expect(bufficorn.getScore(Trait.Coat)).toStrictEqual(30)
    expect(bufficorn.getScore(Trait.Coolness)).toStrictEqual(40)
    expect(bufficorn.getScore(Trait.Speed)).toStrictEqual(50)
    expect(bufficorn.getScore(Trait.Stamina)).toStrictEqual(60)
  })

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

  function auxBufficornInfo(
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
    }
  }

  it('getLeaderboard', async () => {
    const bufficorn_0 = auxBufficorn(0, [10, 20, 30, 40, 50, 60])
    const bufficorn_1 = auxBufficorn(1, [21, 31, 41, 51, 61, 11])
    const bufficorn_2 = auxBufficorn(2, [32, 42, 52, 62, 12, 22])

    let sortedBufficorns = Bufficorn.getLeaderboard([
      bufficorn_0,
      bufficorn_1,
      bufficorn_2,
    ])

    let expected_0 = auxBufficornInfo(bufficorn_0, 2, 10)
    let expected_1 = auxBufficornInfo(bufficorn_1, 1, 11)
    let expected_2 = auxBufficornInfo(bufficorn_2, 0, 12)
    expect(sortedBufficorns).toStrictEqual([expected_2, expected_1, expected_0])

    let sortedBufficornsByStamina = Bufficorn.getLeaderboard(
      [bufficorn_0, bufficorn_1, bufficorn_2],
      Trait.Stamina
    )

    expected_0 = auxBufficornInfo(bufficorn_0, 0, 60)
    expected_1 = auxBufficornInfo(bufficorn_1, 2, 11)
    expected_2 = auxBufficornInfo(bufficorn_2, 1, 22)
    expect(sortedBufficornsByStamina).toStrictEqual([
      expected_0,
      expected_2,
      expected_1,
    ])
  })
})
