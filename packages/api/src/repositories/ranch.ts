import { Collection, Db, WithId } from 'mongodb'

import { RanchName, Trait, DbRanch } from '../types'
import { RANCH_COUNT } from '../constants'

export class RanchRepository {
  private collection: Collection<WithId<DbRanch>>

  constructor(db: Db) {
    this.collection = db.collection('ranches')
  }

  /**
   * Generate as many ranches as specified in the `count` argument.
   * @param force If provided and set to `true`, circumvent the double bootstrapping protection.
   */
  public async bootstrap(
    force: Boolean = false
  ): Promise<Array<DbRanch> | null> {
    // Tell if the collection is already bootstrapped
    const isAlreadyBootstrapped =
      (await this.collection.estimatedDocumentCount()) > 0

    // Prevent accidental bootstrapping if the collection is already bootstrapped
    if (isAlreadyBootstrapped && !force) {
      return null
    }
    const ranches = []
    for (let index = 0; index < RANCH_COUNT; index++) {
      const ranch = {
        name: RanchName[index],
        resource: Trait[index],
        medals: [],
      }
      await this.create(ranch)
      ranches.push(ranch)
    }
    return ranches
  }

  public async create(ranch: DbRanch): Promise<DbRanch> {
    const isAlreadyCreated = await this.get(ranch.name)

    if (isAlreadyCreated) {
      throw new Error(`Ranch with name ${ranch.name} already exists`)
    }

    const success = await this.collection.insertOne(ranch)

    if (!success.acknowledged)
      throw new Error(`Ranch could not be created (name: ${ranch.name})`)

    return ranch
  }

  public async update(ranch: DbRanch): Promise<DbRanch> {
    const isAlreadyCreated = await this.get(ranch.name)

    if (!isAlreadyCreated) {
      throw new Error(`Ranch does not exist (name: ${ranch.name})`)
    }

    const success = await this.collection.updateOne(
      { name: ranch.name },
      { $set: ranch },
      { upsert: false }
    )

    if (!success.acknowledged)
      throw new Error(`Ranch could not be updated (name: ${ranch.name})`)

    return ranch
  }

  public async get(name: string): Promise<WithId<DbRanch> | null> {
    return await this.collection.findOne({ name })
  }
}
