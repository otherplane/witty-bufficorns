import { Collection, Db, WithId } from 'mongodb'

import { Bufficorn, Resource } from '../types'
import { BUFFICORNS_PER_RANCH, RANCH_COUNT } from '../constants'
import { getRanchFromIndex } from '../utils'
import { Repository } from '../repository'

export class BufficornModel {
  private collection: Collection<Bufficorn>
  private repository: Repository<Bufficorn>

  constructor(db: Db) {
    this.collection = db.collection('bufficorns')
    this.repository = new Repository(this.collection, 'name')
  }

  public createBufficorn(index: number) {
    return {
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
  }

  /**
   * Generate as many ranches as specified in the `count` argument.
   * @param force If provided and set to `true`, circumvent the double bootstrapping protection.
   */
  public async bootstrap(
    force: boolean = false
  ): Promise<Array<Bufficorn> | null> {
    return this.repository.bootstrap(
      (_: null, index: number) => this.createBufficorn(index),
      BUFFICORNS_PER_RANCH * RANCH_COUNT,
      force
    )
  }

  public async create(bufficorn: Bufficorn): Promise<Bufficorn> {
    const { name } = bufficorn
    const bufficornExists = await this.repository.getOne({ name })

    if (bufficornExists) {
      throw new Error(`Bufficorn with name ${name} already exists`)
    }

    return this.repository.create(bufficorn)
  }

  public async update(bufficorn: Bufficorn): Promise<Bufficorn> {
    const { name } = bufficorn
    const exists = await this.repository.getOne({ name })

    if (!exists) {
      throw new Error(`Bufficorn does not exist (name: ${bufficorn.name})`)
    }

    return await this.repository.updateOne({ name }, bufficorn)
  }

  public async getBufficornsByRanch(
    name: string
  ): Promise<Array<WithId<Bufficorn>> | null> {
    return await this.repository.get({ ranch: name })
  }

  public async getOne(name: string): Promise<WithId<Bufficorn> | null> {
    return await this.repository.getOne({ name })
  }

  public feed(id: string, resource: Resource): Promise<WithId<Bufficorn>> {
    const existsBufficorn = this.repository.getById(id)

    if (!existsBufficorn) {
      throw new Error(`Bufficorn with id ${id} doesn't exist`)
    }

    return this.repository.updateOne(
      { id },
      {
        [resource.trait]: resource.amount,
      }
    )
  }
}
