import { Collection, Db, WithId } from 'mongodb'

import { EggMetadata } from '../types'

export class MetadataRepository {
  private collection: Collection<WithId<EggMetadata>>

  constructor(db: Db) {
    this.collection = db.collection('metadata')
  }

  public async create(metadataOutput: EggMetadata): Promise<EggMetadata> {
    const success = await this.collection.insertOne(metadataOutput)

    if (!success.acknowledged)
      throw new Error(`Metadata object could not be created`)

    return metadataOutput
  }

  public async get(tokenId: number): Promise<WithId<EggMetadata> | null> {
    return await this.collection.findOne({
      token_id: tokenId,
    })
  }
}
