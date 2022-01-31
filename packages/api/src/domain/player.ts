import {
  RanchName,
  DbPlayerVTO,
  PlayerLeaderboardInfo,
  ObjectId,
  ExtendedPlayerVTO,
} from '../types'
import { Ranch } from './ranch'
import { Trade } from './trade'

export class Player {
  token?: string
  lastTradeIn?: Trade
  lastTradeOut?: Trade
  key: string
  username: string
  ranch: RanchName
  points: number
  medals: Array<string> = []
  id?: ObjectId
  selectedBufficorn: number
  creationIndex: number

  constructor(vto: DbPlayerVTO) {
    this.key = vto.key
    this.username = vto.username
    this.ranch = vto.ranch
    this.points = vto.points
    this.medals = vto.medals
    this.token = vto.token
    this.id = new ObjectId(vto.id)
    this.selectedBufficorn = vto.selectedBufficorn
    this.creationIndex = vto.creationIndex
  }

  toDbVTO(shoWToken: boolean = false): DbPlayerVTO {
    const vto = {
      key: this.key,
      username: this.username,
      ranch: this.ranch,
      points: this.points,
      medals: this.medals,
      token: this.token,
      id: this.id?.toString(),
      selectedBufficorn: this.selectedBufficorn,
      creationIndex: this.creationIndex,
    }

    return shoWToken ? { ...vto, token: this.token } : vto
  }

  static getLeaderboard(
    players: Array<Player>,
    totalPlayers: number,
    paginationOffset: number = 0
  ): { players: Array<PlayerLeaderboardInfo>; total: number } {
    return {
      players: players.map((p, index) => ({
        ...p,
        position: paginationOffset + index,
      })),
      total: totalPlayers,
    }
  }

  toExtendedPlayerVTO(
    ranch: Ranch,
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
        ranch: ranch.toVTO(),
      },
      lastTradeIn: lastTradeIn?.isActive() ? lastTradeIn.toVTO() : null,
      lastTradeOut: lastTradeOut?.isActive() ? lastTradeOut.toVTO() : null,
    }
  }
}
