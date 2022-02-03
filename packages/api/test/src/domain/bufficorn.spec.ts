import { Bufficorn } from '../../../src/domain/bufficorn'
import { Trait } from '../../../src/types'
import { auxBufficorn, auxBufficornInfo } from '../../utils'

describe('bufficorn.ts', () => {
  it('calculateScore', async () => {
    const bufficorn = new Bufficorn(undefined, 0)

    // Empty bufficorn
    expect(bufficorn.calculateScore()).toStrictEqual(0)
    expect(bufficorn.calculateScore(Trait.Vigor)).toStrictEqual(0)

    bufficorn.stats.vigor = 10

    // Bufficorn with only one valued trait
    expect(bufficorn.calculateScore()).toStrictEqual(0)
    expect(bufficorn.calculateScore(Trait.Vigor)).toStrictEqual(10)

    bufficorn.stats.intelligence = 20
    bufficorn.stats.coat = 30
    bufficorn.stats.coolness = 40
    bufficorn.stats.speed = 50
    bufficorn.stats.stamina = 60

    // Bufficorn with all valued traits
    expect(bufficorn.calculateScore()).toStrictEqual(10)
    expect(bufficorn.calculateScore(Trait.Vigor)).toStrictEqual(10)
    expect(bufficorn.calculateScore(Trait.Intelligence)).toStrictEqual(20)
    expect(bufficorn.calculateScore(Trait.Coat)).toStrictEqual(30)
    expect(bufficorn.calculateScore(Trait.Coolness)).toStrictEqual(40)
    expect(bufficorn.calculateScore(Trait.Speed)).toStrictEqual(50)
    expect(bufficorn.calculateScore(Trait.Stamina)).toStrictEqual(60)
  })

  it('getLeaderboard', async () => {
    const bufficorn_0 = auxBufficorn(0, [10, 20, 30, 40, 50, 60])
    const bufficorn_1 = auxBufficorn(1, [21, 31, 41, 51, 61, 11])
    const bufficorn_2 = auxBufficorn(2, [32, 42, 52, 62, 12, 22])

    const sortedBufficorns = Bufficorn.getLeaderboard([
      bufficorn_0,
      bufficorn_1,
      bufficorn_2,
    ])
    const sortedBufficornsByStamina = Bufficorn.getLeaderboard(
      [bufficorn_0, bufficorn_1, bufficorn_2],
      Trait.Vigor
    )

    // GetLeaderboard without a specified trait
    const expected_0 = auxBufficornInfo(bufficorn_0, 2, 10)
    const expected_1 = auxBufficornInfo(bufficorn_1, 1, 11)
    const expected_2 = auxBufficornInfo(bufficorn_2, 0, 12)
    expect(sortedBufficorns).toStrictEqual([expected_2, expected_1, expected_0])

    // GetLeaderboard using Stamina trait
    const expectedByVigor_0 = auxBufficornInfo(bufficorn_0, 0, 60)
    const expectedByVigor_1 = auxBufficornInfo(bufficorn_1, 2, 11)
    const expectedByVigor_2 = auxBufficornInfo(bufficorn_2, 1, 22)

    expect(sortedBufficornsByStamina).toStrictEqual([
      expectedByVigor_0,
      expectedByVigor_2,
      expectedByVigor_1,
    ])
  })
})
