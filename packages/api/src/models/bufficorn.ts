import { Collection, Db } from 'mongodb'

import { BufficornVTO, RanchName, Resource } from '../types'
import { BUFFICORNS_PER_RANCH, RANCHES_COUNT } from '../constants'
import { Repository } from '../repository'
import { Bufficorn } from '../domain/bufficorn'

export class BufficornModel {
  private collection: Collection<BufficornVTO>
  private repository: Repository<BufficornVTO>

  constructor(db: Db) {
    this.collection = db.collection('bufficorns')
    this.repository = new Repository(this.collection, 'name')
  }

  /**
   * Generate as many ranches as specified in the `count` argument.
   * @param force If provided and set to `true`, circumvent the double bootstrapping protection.
   */
  public async bootstrap(
    force: boolean = false
  ): Promise<Array<Bufficorn> | null> {
    const vtos = await this.repository.bootstrap(
      (_: null, index: number) => new Bufficorn(undefined, index).toVTO(),
      BUFFICORNS_PER_RANCH * RANCHES_COUNT,
      force
    )

    return vtos ? vtos.map((vto) => new Bufficorn(vto)) : null
  }

  public async create(bufficorn: BufficornVTO): Promise<Bufficorn> {
    const { name } = bufficorn
    const bufficornExists = await this.repository.getOne({ name })

    if (bufficornExists) {
      throw new Error(`Bufficorn with name ${name} already exists`)
    }

    return new Bufficorn(await this.repository.create(bufficorn))
  }

  public async update(bufficorn: BufficornVTO): Promise<Bufficorn> {
    const { name } = bufficorn
    const exists = await this.repository.getOne({ name })

    if (!exists) {
      throw new Error(`Bufficorn does not exist (name: ${name})`)
    }

    return new Bufficorn(await this.repository.updateOne({ name }, bufficorn))
  }

  public async getBufficornsByRanch(
    name: string
  ): Promise<Array<Bufficorn> | null> {
    const vtos = await this.repository.getSortedByName({
      ranch: name as RanchName,
    })

    return vtos.map((vto) => new Bufficorn(vto))
  }

  public async getAll(): Promise<Array<Bufficorn>> {
    return (await this.repository.get({})).map((vto) => new Bufficorn(vto))
  }

  public async getOne(name: string): Promise<Bufficorn | null> {
    const vto = await this.repository.getOne({ name })

    return vto ? new Bufficorn(vto) : null
  }

  public async feed(
    creationIndex: number,
    resource: Resource,
    ranch: RanchName
  ): Promise<Bufficorn> {
    const bufficorn = await this.repository.getOne({ creationIndex, ranch })

    if (!bufficorn) {
      throw new Error(
        `Bufficorn with creation index ${creationIndex} and ranch ${ranch} doesn't exist`
      )
    }

    if (ranch !== bufficorn.ranch) {
      throw new Error(
        `Bufficorn with name creation index ${creationIndex} and ranch ${ranch} doesn't belong to your ranch`
      )
    }

    return new Bufficorn(
      await this.repository.updateOne(
        { creationIndex, ranch },
        {
          [resource.trait]: resource.amount + bufficorn[resource.trait],
        }
      )
    )
  }
}
