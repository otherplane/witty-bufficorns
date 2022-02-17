import crypto from 'crypto'
import { Collection, Db } from 'mongodb'

import {
  BUFFICORNS_INDEX_GROUP_BY_RANCH,
  PLAYER_KEY_LENGTH_BYTES,
  PLAYER_KEY_SALT,
  RANCHES_COUNT,
  TRADE_POINTS,
  TRADE_POINTS_DIVISOR,
  TRADE_POINTS_MIN,
  TRAIT_BY_RANCH,
  BONUS_MULTIPLIER,
  TESTNET_POINTS_DIVISOR,
} from '../constants'
import {
  generateUsernameList,
  getRanchFromIndex,
  isMainnetTime,
} from '../utils'
import { DbPlayerVTO, DbTradeVTO, RanchName } from '../types'
import {} from '../utils'
import {} from '../types'
import { Repository } from '../repository'
import { Player } from '../domain/player'

export class PlayerModel {
  private collection: Collection<DbPlayerVTO>
  private repository: Repository<DbPlayerVTO>

  constructor(db: Db) {
    this.collection = db.collection('players')
    this.repository = new Repository(this.collection, 'username')

    this.collection.createIndex({ username: 1 })
    this.collection.createIndex({ key: 1 })
    this.collection.createIndex({ token: 1, points: -1 })
  }

  public createPlayer(
    index: number,
    getUsername: (index: number) => string
  ): Player {
    const isBonusPlayer = index >= 9000
    // Generate the player data.
    // First we derive a deterministic 32-bytes sequence of bytes from a fixed salt plus the player nonce.
    const seed = crypto
      .createHash('sha256')
      .update(`${PLAYER_KEY_SALT}|${index}`)
      .digest()
    // We will be using the hexadecimal representation of the first `PLAYER_ID_LENGTH_BYTES` of the seed as the player key.
    const key: string = seed.slice(0, PLAYER_KEY_LENGTH_BYTES).toString('hex')
    const username = getUsername(index)
    const medals: Array<string> = []
    const ranch = isBonusPlayer ? 'WITNET_RANCH' : getRanchFromIndex(index)
    const points: number = 0
    const testnetPoints: number = 0
    const scannedBonuses: Array<string> = []
    const bonusEndsAt: number = 0

    const bufficornIndex = Math.floor(index / RANCHES_COUNT) % 4

    const selectedBufficorn = isBonusPlayer
      ? -1
      : BUFFICORNS_INDEX_GROUP_BY_RANCH[ranch as RanchName][bufficornIndex]

    return new Player({
      key,
      username,
      ranch,
      medals,
      points,
      testnetPoints,
      selectedBufficorn,
      creationIndex: index,
      bonusEndsAt,
      scannedBonuses,
    })
  }

  /**
   * Generate as many players as specified in the `count` argument.
   * @param count How many players to generate
   * @param force If provided and set to `true`, circumvent the double bootstrapping protection.
   */
  public async bootstrap(
    count: number,
    force: boolean = false
  ): Promise<Array<Player> | null> {
    // Generate list of unique usernames to avoid name collisions
    const usernamesList = generateUsernameList(count)
    const getUsername = (index: number) => usernamesList[index]
    const vtos = await this.repository.bootstrap(
      (_: null, index: number) =>
        this.createPlayer(index, getUsername).toDbVTO(),
      count,
      force
    )

    return vtos?.map((vto) => new Player(vto)) || null
  }

  public async update(player: DbPlayerVTO): Promise<Player> {
    const { username } = player

    return new Player(await this.repository.updateOne({ username }, player))
  }

  public async get(key: string): Promise<Player | null> {
    const vto = await this.repository.getOne({ key })

    return vto ? new Player(vto) : null
  }

  public generateResource(
    player: DbPlayerVTO,
    lastTrade: DbTradeVTO | null,
    targetPlayerBonusEndsAt: number
  ) {
    // Compute points
    let amount
    if (!lastTrade) {
      amount = isMainnetTime()
        ? TRADE_POINTS
        : TRADE_POINTS / TESTNET_POINTS_DIVISOR
    } else {
      amount = lastTrade.resource.amount
      // If the last trade had a bonus, remove the bonus to get the real amount
      if (lastTrade.bonusFlag) {
        amount = amount / BONUS_MULTIPLIER
      }
      // Apply division to make consecutive trades give exponentially less points over time
      amount = amount / TRADE_POINTS_DIVISOR
    }

    // Round to integer
    amount = Math.round(amount)

    // A trade must give at least TRADE_POINTS_MIN
    amount = Math.max(
      amount,
      isMainnetTime()
        ? TRADE_POINTS_MIN
        : TRADE_POINTS_MIN / TESTNET_POINTS_DIVISOR
    )

    // If this trade has a bonus, add bonus amount and set bonusFlag
    const currentTimestamp = Date.now()
    const bonusFlag = currentTimestamp < targetPlayerBonusEndsAt
    if (bonusFlag) {
      amount = amount * BONUS_MULTIPLIER
    }

    // Get trait
    const ranchName = player.ranch

    return {
      amount,
      trait: Player.isBonusPlayer(ranchName)
        ? undefined
        : TRAIT_BY_RANCH[ranchName as RanchName],
      bonusFlag,
    }
  }

  public async getAllRegistered(): Promise<Array<Player>> {
    // TODO: Remove mongoDB $exists from model
    const vtos = await this.repository.get({
      token: { $exists: true, $ne: undefined },
    })

    return vtos.map((vto) => new Player(vto))
  }

  public async getMany(paginationParams: {
    limit: number
    offset: number
  }): Promise<Array<Player>> {
    // TODO: Remove mongoDB $exists from model
    const vtos = await this.repository.getSortedBy(
      {
        token: { $exists: true, $ne: undefined },
        ranch: { $ne: 'WITNET_RANCH' },
      },
      {
        testnetPoints: -1,
      },
      paginationParams
    )

    return vtos.map((vto) => new Player(vto))
  }

  public async getOne(id: string): Promise<Player | null> {
    const vto = await this.repository.getById(id)

    return vto ? new Player(vto) : null
  }

  public async updateSelectedBufficorn(
    username: string,
    creationIndex: number
  ): Promise<Player | null> {
    const vto = await this.repository.updateOne(
      { username },
      { selectedBufficorn: creationIndex }
    )

    return vto ? new Player(vto) : null
  }

  public async updateBonuses(
    username: string,
    scannedBonuses: Array<string>,
    bonusEndsAt: number
  ): Promise<Player | null> {
    const vto = await this.repository.updateOne(
      { username },
      { bonusEndsAt, scannedBonuses }
    )

    return vto ? new Player(vto) : null
  }

  public async countActive() {
    return this.repository.count({ token: { $exists: true, $ne: undefined } })
  }
}
