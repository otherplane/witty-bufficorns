import { Collection, Db } from 'mongodb'

import { MedalMetadata } from '../types'

import { Repository } from '../repository'

export class MetadataModel {
  private collection: Collection<MedalMetadata>
  private repository: Repository<MedalMetadata>

  constructor(db: Db) {
    this.collection = db.collection('metadata')
    this.repository = new Repository(this.collection, 'name')
  }

  public async create(metadataOutput: MedalMetadata): Promise<MedalMetadata> {
    const success = this.repository.create(metadataOutput)

    if (!success) throw new Error(`Metadata object could not be created`)

    return metadataOutput
  }

  public async get(tokenId: number): Promise<MedalMetadata | null> {
    return await this.repository.getOne({ token_id: tokenId })
  }
}
