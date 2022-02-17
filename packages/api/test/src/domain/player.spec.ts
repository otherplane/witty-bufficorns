import { Player } from '../../../src/domain/player'
import { RanchName } from '../../../src/types'

const playerVTOs = [
  {
    creationIndex: 0,
    key: 'aaa',
    medals: [],
    points: 0,
    ranch: RanchName.Ranch1,
    scannedBonuses: [],
    selectedBufficorn: 0,
    testnetPoints: 0,
    username: 'aaa',
    bonusEndsAt: 0,
  },
  {
    creationIndex: 1,
    key: 'bbb',
    medals: [],
    points: 0,
    ranch: RanchName.Ranch1,
    scannedBonuses: [],
    selectedBufficorn: 0,
    testnetPoints: 111,
    username: 'bbb',
    bonusEndsAt: 0,
  },
  {
    creationIndex: 2,
    key: 'ccc',
    medals: [],
    points: 0,
    ranch: RanchName.Ranch2,
    scannedBonuses: [],
    selectedBufficorn: 0,
    testnetPoints: 222,
    username: 'ccc',
    bonusEndsAt: 0,
  },
  {
    creationIndex: 3,
    key: 'ddd',
    medals: [],
    points: 0,
    ranch: RanchName.Ranch2,
    scannedBonuses: [],
    selectedBufficorn: 0,
    testnetPoints: 333,
    username: 'ddd',
    bonusEndsAt: 0,
  },
  {
    creationIndex: 4,
    key: 'eee',
    medals: [],
    points: 0,
    ranch: RanchName.Ranch2,
    scannedBonuses: [],
    selectedBufficorn: 0,
    testnetPoints: 444,
    username: 'eee',
    bonusEndsAt: 0,
  },
  {
    creationIndex: 5,
    key: 'fff',
    medals: [],
    points: 0,
    ranch: RanchName.Ranch3,
    scannedBonuses: [],
    selectedBufficorn: 0,
    testnetPoints: 555,
    username: 'fff',
    bonusEndsAt: 0,
  },
  {
    creationIndex: 6,
    key: 'ggg',
    medals: [],
    points: 0,
    ranch: RanchName.Ranch4,
    scannedBonuses: [],
    selectedBufficorn: 0,
    testnetPoints: 666,
    username: 'ggg',
    bonusEndsAt: 0,
  },
  {
    creationIndex: 7,
    key: 'hhh',
    medals: [],
    points: 0,
    ranch: RanchName.Ranch4,
    scannedBonuses: [],
    selectedBufficorn: 0,
    testnetPoints: 777,
    username: 'hhh',
    bonusEndsAt: 0,
  },
  {
    creationIndex: 8,
    key: 'iii',
    medals: [],
    points: 0,
    ranch: RanchName.Ranch4,
    scannedBonuses: [],
    selectedBufficorn: 0,
    testnetPoints: 888,
    username: 'iii',
    bonusEndsAt: 0,
  },
  {
    creationIndex: 9,
    key: 'jjj',
    medals: [],
    points: 0,
    ranch: RanchName.Ranch5,
    scannedBonuses: [],
    selectedBufficorn: 0,
    testnetPoints: 999,
    username: 'jjj',
    bonusEndsAt: 0,
  },
]

describe.skip('domain player', () => {
  it('leaderboard', () => {
    const players: Array<Player> = playerVTOs.map((p) => new Player(p))

    const leaderboard = Player.getLeaderboard(players, players.length)
    expect(leaderboard.players[0].points).toBe(999)
    expect(leaderboard.players[1].points).toBe(888)
    expect(leaderboard.players[2].points).toBe(777)
    expect(leaderboard.players[3].points).toBe(666)
    expect(leaderboard.players[4].points).toBe(555)
    expect(leaderboard.players[5].points).toBe(444)
    expect(leaderboard.players[6].points).toBe(333)
    expect(leaderboard.players[7].points).toBe(222)
    expect(leaderboard.players[8].points).toBe(111)
    expect(leaderboard.players[9].points).toBe(0)
  })
})
