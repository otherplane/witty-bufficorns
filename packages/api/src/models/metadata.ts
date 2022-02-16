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
    const metadata = await this.repository.getOne({ token_id: tokenId })

    if (
      metadata?.attributes.length &&
      metadata.description &&
      metadata.external_url &&
      metadata.image &&
      metadata.name
    ) {
      return {
        // TODO: remove any and add a strong type
        attributes: metadata?.attributes as any,
        description: metadata?.description,
        external_url: metadata?.external_url,
        image: metadata?.image,
        name: metadata?.name,
      }
    } else {
      return null
    }
  }
}
