import { POAP_BONUS_TIME } from '../constants'
import {
  RanchName,
  DbPlayerVTO,
  PlayerLeaderboardInfo,
  ObjectId,
  ExtendedPlayerVTO,
  BonusRanchName,
} from '../types'
import { Ranch } from './ranch'
import { Trade } from './trade'
import { isMainnetTime } from '../utils'

export class Player {
  token?: string
  lastTradeIn?: Trade
  lastTradeOut?: Trade
  key: string
  username: string
  ranch: RanchName | BonusRanchName
  points: number
  testnetPoints: number
  medals: Array<string> = []
  id?: ObjectId
  selectedBufficorn: number
  creationIndex: number
  bonusEndsAt: number
  scannedBonuses: Array<string> = []

  constructor(vto: DbPlayerVTO) {
    this.key = vto.key
    this.username = vto.username
    this.ranch = vto.ranch
    this.points = vto.points
    this.testnetPoints = vto.testnetPoints
    this.medals = vto.medals
    this.token = vto.token
    this.id = new ObjectId(vto.id)
    this.selectedBufficorn = vto.selectedBufficorn
    this.creationIndex = vto.creationIndex
    this.bonusEndsAt = vto.bonusEndsAt
    this.scannedBonuses = vto.scannedBonuses
  }

  toDbVTO(shoWToken: boolean = false): DbPlayerVTO {
    const vto = {
      key: this.key,
      username: this.username,
      ranch: this.ranch,
      points: this.points,
      testnetPoints: this.testnetPoints,
      medals: this.medals,
      token: this.token,
      id: this.id?.toString(),
      selectedBufficorn: this.selectedBufficorn,
      creationIndex: this.creationIndex,
      bonusEndsAt: this.bonusEndsAt,
      scannedBonuses: this.scannedBonuses,
    }

    return shoWToken ? { ...vto, token: this.token } : vto
  }

  static getLeaderboard(
    players: Array<Player>,
    totalPlayers: number,
    paginationOffset: number = 0
  ): { players: Array<PlayerLeaderboardInfo>; total: number } {
    return {
      players: players
        .sort(
          (a, b) =>
            // sort by creation index if the players are tied
            b.points - a.points || a.username.localeCompare(b.username)
        )
        .map((p, index) => ({
          username: p.username,
          creationIndex: p.creationIndex,
          points: isMainnetTime() ? p.points : p.testnetPoints,
          position: paginationOffset + index,
        })),
      total: totalPlayers,
    }
  }

  toExtendedPlayerVTO(
    ranch: Ranch | null,
    {
      lastTradeOut,
      lastTradeIn,
    }: { lastTradeIn?: Trade | null; lastTradeOut: Trade | null }
  ): ExtendedPlayerVTO {
    // Get all Player attributes except token
    const { token, ...protectedplayerVTO } = this.toDbVTO()
    return {
      player: {
        ...protectedplayerVTO,
        ranch: ranch ? ranch.toVTO() : Ranch.getBonusRanchVTO(),
      },
      lastTradeIn: lastTradeIn?.isActive() ? lastTradeIn.toVTO() : null,
      lastTradeOut: lastTradeOut?.isActive() ? lastTradeOut.toVTO() : null,
    }
  }

  addBonusTime(currentTimestamp: number) {
    this.bonusEndsAt =
      Math.max(currentTimestamp, this.bonusEndsAt) + POAP_BONUS_TIME
  }
  isBonusPlayer(): boolean {
    return Player.isBonusPlayer(this.ranch)
  }

  static isBonusPlayer(ranch: string): boolean {
    return ranch === 'WITNET_RANCH'
  }
}
