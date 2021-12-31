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
import { Repository } from '../repository'

export class PlayerModel {
  private collection: Collection<DbPlayer>
  private repository: Repository<DbPlayer>

  constructor(db: Db) {
    this.collection = db.collection('players')
    this.repository = new Repository(this.collection, 'username')
  }

  public createPlayer(index: number) {
    // Generate the player data.
    // First we derive a deterministic 32-bytes sequence of bytes from a fixed salt plus the player nonce.
    const seed = crypto
      .createHash('sha256')
      .update(`${PLAYER_KEY_SALT}|${index}`)
      .digest()
    // We will be using the hexadecimal representation of the first `PLAYER_ID_LENGTH_BYTES` of the seed as the player key.
    const key: string = seed.slice(0, PLAYER_KEY_LENGTH_BYTES).toString('hex')
    // FIXME: avoid repeated usernames
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
    return { key, username, ranch, medals, points }
  }

  /**
   * Generate as many players as specified in the `count` argument.
   * @param count How many players to generate
   * @param force If provided and set to `true`, circumvent the double bootstrapping protection.
   */
  public async bootstrap(
    count: number,
    force: boolean = false
  ): Promise<Array<DbPlayer> | null> {
    return this.repository.bootstrap(
      (_: null, index: number) => this.createPlayer(index),
      count,
      force
    )
  }

  public async create(player: DbPlayer): Promise<DbPlayer> {
    const { username } = player
    const bufficornExists = await this.repository.getOne({ username })

    if (bufficornExists) {
      throw new Error(`Player with name ${username} already exists`)
    }

    return this.repository.create(player)
  }

  public async update(player: DbPlayer): Promise<DbPlayer> {
    const { username } = player
    const exists = await this.repository.getOne({ username })

    if (!exists) {
      throw new Error(`Player does not exist (name: ${player.username})`)
    }

    return await this.repository.updateOne({ username }, player)
  }

  public async get(key: string): Promise<WithId<DbPlayer> | null> {
    return await this.repository.getOne({ key })
  }
}
