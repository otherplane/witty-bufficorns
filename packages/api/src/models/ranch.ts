import { Collection, Db } from 'mongodb'

import { DbRanchVTO, RanchName } from '../types'
import { INDEX_TO_RANCH, RANCHES_COUNT } from '../constants'
import { Repository } from '../repository'
import { Ranch } from '../domain/ranch'
import { Bufficorn } from '../domain/bufficorn'
import { groupBufficornsByRanch } from '../utils'

export class RanchModel {
  private collection: Collection<DbRanchVTO>
  private repository: Repository<DbRanchVTO>

  constructor(db: Db) {
    this.collection = db.collection('ranches')
    this.repository = new Repository(this.collection, 'name')

    this.collection.createIndex({ name: 1 })
  }

  /**
   * Generate as many ranches as specified in the `count` argument.
   * @param bufficorns All bufficorns to be included in the new ranches
   * @param force If provided and set to `true`, circumvent the double bootstrapping protection.
   */
  public async bootstrap(
    bufficorns: Array<Bufficorn>,
    force: boolean = false
  ): Promise<Array<Ranch> | null> {
    const bufficornsByRanch = groupBufficornsByRanch(bufficorns)

    const vtos = await this.repository.bootstrap(
      (_: null, index: number) => {
        const filteredBufficorns = bufficornsByRanch[INDEX_TO_RANCH[index]]

        return new Ranch(undefined, index, filteredBufficorns).toDbVTO()
      },
      RANCHES_COUNT,
      force
    )

    return vtos
      ? vtos.map(
          (vto, index) =>
            new Ranch(vto, undefined, bufficornsByRanch[INDEX_TO_RANCH[index]])
        )
      : null
  }

  public async create(ranch: DbRanchVTO): Promise<Ranch> {
    const { name } = ranch
    const ranchExists = await this.repository.getOne({ name })

    if (ranchExists) {
      throw new Error(`Ranch with name ${name} already exists`)
    }

    return new Ranch(await this.repository.create(ranch))
  }

  public async update(ranch: DbRanchVTO): Promise<Ranch> {
    const { name } = ranch
    const exists = await this.repository.getOne({ name })

    if (!exists) {
      throw new Error(`Ranch does not exist (name: ${ranch.name})`)
    }

    return new Ranch(await this.repository.updateOne({ name }, ranch))
  }

  public async getAll(): Promise<Array<Ranch>> {
    return (await this.repository.get({})).map((dbRanch) => new Ranch(dbRanch))
  }

  public async getByName(name: RanchName): Promise<Ranch | null> {
    const vto = await this.repository.getOne({ name })

    return vto ? new Ranch(vto) : null
  }
}
