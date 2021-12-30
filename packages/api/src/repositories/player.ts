import crypto from 'crypto'
import { Collection, Db, WithId } from 'mongodb'
import {
  uniqueNamesGenerator,
  adjectives,
  animals,
} from 'unique-names-generator'

import { PLAYER_KEY_LENGTH_BYTES, PLAYER_KEY_SALT } from '../constants'
import { getRanchFromIndex } from '../utils'
import { DbPlayer } from '../types'

export class PlayerRepository {
  private collection: Collection<WithId<DbPlayer>>

  constructor(db: Db) {
    this.collection = db.collection('players')
  }

  /**
   * Generate as many players as specified in the `count` argument.
   * @param count How many players to generate
   * @param force If provided and set to `true`, circumvent the double bootstrapping protection.
   */
  public async bootstrap(
    count: Number,
    force: Boolean = false
  ): Promise<Array<DbPlayer> | null> {
    // Tell if the collection is already bootstrapped
    const isAlreadyBootstrapped =
      (await this.collection.estimatedDocumentCount()) > 0

    // Prevent accidental bootstrapping if the collection is already bootstrapped
    if (isAlreadyBootstrapped && !force) {
      return null
    }

    // Generate `count` players
    const players = []
    for (let index = 0; index < count; index++) {
      // Generate the player data.
      // First we derive a deterministic 32-bytes sequence of bytes from a fixed salt plus the player nonce.
      const seed = crypto
        .createHash('sha256')
        .update(`${PLAYER_KEY_SALT}|${index}`)
        .digest()
      // We will be using the hexadecimal representation of the first `PLAYER_ID_LENGTH_BYTES` of the seed as the player key.
      const key: string = seed.slice(0, PLAYER_KEY_LENGTH_BYTES).toString('hex')
      // The rest of the bytes of the seed will be used for seeding the unique names generator.
      const username: string = uniqueNamesGenerator({
        dictionaries: [adjectives, animals],
        seed: seed.slice(PLAYER_KEY_LENGTH_BYTES).readUInt32BE(),
        separator: '-',
        style: 'lowerCase',
      })
      const medals: Array<string> = []
      const ranch: string = getRanchFromIndex(index)
      const points: number = 0
      // Create an player based on that player data and push it to our collection
      const player: DbPlayer = { key, username, ranch, medals, points }
      await this.create(player)
      players.push(player)
    }

    return players
  }

  public async create(player: DbPlayer): Promise<DbPlayer> {
    const isAlreadyCreated = await this.get(player.key)

    if (isAlreadyCreated) {
      throw new Error(`Player with key ${player.key} already exists`)
    }

    const success = await this.collection.insertOne(player)

    if (!success.acknowledged)
      throw new Error(`Player could not be created (key: ${player.key})`)

    return player
  }

  public async update(player: DbPlayer): Promise<DbPlayer> {
    const isAlreadyCreated = await this.get(player.key)

    if (!isAlreadyCreated) {
      throw new Error(`Player does not exist (key: ${player.key})`)
    }

    const success = await this.collection.updateOne(
      { key: player.key },
      { $set: player },
      { upsert: false }
    )

    if (!success.acknowledged)
      throw new Error(`Player could not be updated (key: ${player.key})`)

    return player
  }

  public async get(key: string): Promise<WithId<DbPlayer> | null> {
    return await this.collection.findOne({ key })
  }
}
