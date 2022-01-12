import { Collection, Db, WithId } from 'mongodb'

import { ObjectId, MintOutput } from '../types'
import { Repository } from '../repository'

export class MintModel {
  private collection: Collection<MintOutput>
  private repository: Repository<MintOutput>

  constructor(db: Db) {
    this.collection = db.collection('mints')
    // FIXME: allow nested objects: data.index
    this.repository = new Repository(this.collection, 'data')
  }

  public async create(
    mintOutput: MintOutput,
    playerId: ObjectId
  ): Promise<MintOutput> {
    return await this.repository.createWithId(mintOutput, playerId)
  }

  public async get(index: ObjectId): Promise<WithId<MintOutput> | null> {
    return await this.repository.getOne({
      _id: index,
    })
  }
}
