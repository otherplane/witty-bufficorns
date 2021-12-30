import { Collection, Db, WithId } from 'mongodb'

import { Bufficorn } from '../types'
import { BUFFICORNS_PER_RANCH, RANCH_COUNT } from '../constants'
import { getRanchFromIndex } from '../utils'

export class BufficornRepository {
  private collection: Collection<WithId<Bufficorn>>

  constructor(db: Db) {
    this.collection = db.collection('ranches')
  }

  /**
   * Generate as many ranches as specified in the `count` argument.
   * @param force If provided and set to `true`, circumvent the double bootstrapping protection.
   */
  public async bootstrap(
    force: Boolean = false
  ): Promise<Array<Bufficorn> | null> {
    // Tell if the collection is already bootstrapped
    const isAlreadyBootstrapped =
      (await this.collection.estimatedDocumentCount()) > 0

    // Prevent accidental bootstrapping if the collection is already bootstrapped
    if (isAlreadyBootstrapped && !force) {
      return null
    }
    const bufficorns = []
    const bufficornsCount = BUFFICORNS_PER_RANCH * RANCH_COUNT
    for (let index = 0; index < bufficornsCount; index++) {
      const bufficorn = {
        name: `Bufficorn-${index}`,
        ranch: getRanchFromIndex(index),
        vigor: 0,
        speed: 0,
        coolness: 0,
        stamina: 0,
        coat: 0,
        agility: 0,
        medals: [],
      }
      await this.create(bufficorn)
      bufficorns.push(bufficorn)
    }
    return bufficorns
  }

  public async create(bufficorn: Bufficorn): Promise<Bufficorn> {
    const isAlreadyCreated = await this.get(bufficorn.name)

    if (isAlreadyCreated) {
      throw new Error(`Ranch with name ${bufficorn.name} already exists`)
    }

    const success = await this.collection.insertOne(bufficorn)

    if (!success.acknowledged)
      throw new Error(`Ranch could not be created (name: ${bufficorn.name})`)

    return bufficorn
  }

  public async update(bufficorn: Bufficorn): Promise<Bufficorn> {
    const isAlreadyCreated = await this.get(bufficorn.name)

    if (!isAlreadyCreated) {
      throw new Error(`Bufficorn does not exist (name: ${bufficorn.name})`)
    }

    const success = await this.collection.updateOne(
      { name: bufficorn.name },
      { $set: bufficorn },
      { upsert: false }
    )

    if (!success.acknowledged)
      throw new Error(
        `Bufficorn could not be updated (name: ${bufficorn.name})`
      )

    return bufficorn
  }

  public async getBufficornsByRanch(
    name: string
  ): Promise<Array<Bufficorn> | null> {
    return (await this.collection
      .find({ ranch: name })
      .toArray()) as Array<WithId<Bufficorn>>
  }

  public async get(name: string): Promise<WithId<Bufficorn> | null> {
    return (await this.collection.findOne({ name }))
  }
}
