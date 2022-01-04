import { Collection, Db, WithId } from 'mongodb'

import { Repository } from '../repository'
import { DbTrade } from '../types'

export class TradeModel {
  private collection: Collection<DbTrade>
  private repository: Repository<DbTrade>

  constructor(db: Db) {
    this.collection = db.collection('trades')
    this.repository = new Repository(this.collection, 'timestamp')
  }

  public async create(trade: DbTrade): Promise<WithId<DbTrade>> {
    return this.repository.create(trade)
  }

  public async getLast(search: { from?: string; to?: string }) {
    return this.repository.getLast(search)
  }
}
