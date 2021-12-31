import { Collection, Db, WithId } from 'mongodb'

import { RanchName, DbRanch, ranchTraits } from '../types'
import { RANCH_COUNT } from '../constants'
import { Repository } from '../repository'

export class RanchModel {
  private collection: Collection<DbRanch>
  private repository: Repository<DbRanch>

  constructor(db: Db) {
    this.collection = db.collection('ranches')
    this.repository = new Repository(this.collection, 'name')
  }

  public createRanch(index: number) {
    return {
      name: RanchName[index],
      resource: ranchTraits[index],
      medals: [],
    }
  }

  /**
   * Generate as many ranches as specified in the `count` argument.
   * @param force If provided and set to `true`, circumvent the double bootstrapping protection.
   */
  public async bootstrap(
    force: boolean = false
  ): Promise<Array<DbRanch> | null> {
    return this.repository.bootstrap(
      (_: null, index: number) => this.createRanch(index),
      RANCH_COUNT,
      force
    )
  }

  public async create(ranch: DbRanch): Promise<DbRanch> {
    const { name } = ranch
    const ranchExists = await this.repository.getOne({ name })

    if (ranchExists) {
      throw new Error(`Ranch with name ${name} already exists`)
    }

    return this.repository.create(ranch)
  }

  public async update(
    ranch: DbRanch,
    returnNew: boolean = false
  ): Promise<DbRanch> {
    const { name } = ranch
    const exists = await this.repository.getOne({ name })

    if (!exists) {
      throw new Error(`Ranch does not exist (name: ${ranch.name})`)
    }

    return await this.repository.updateOne({ name }, ranch)
  }

  public async get(name: string): Promise<WithId<DbRanch> | null> {
    return await this.repository.getOne({ name })
  }
}
