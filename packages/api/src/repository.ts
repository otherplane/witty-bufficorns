import { Collection, Filter, ObjectId, OptionalId, WithId } from 'mongodb'

export class Repository<T> {
  private collection: Collection<T>
  private keyName: keyof T

  constructor(collection: Collection<T>, keyName: keyof T) {
    this.collection = collection
    this.keyName = keyName
  }

  async bootstrap(
    createElement: (_: null, index: number) => T,
    numberOfElementsToCreate: number,
    force: boolean
  ) {
    // Tell if the collection is already bootstrapped
    const isAlreadyBootstrapped =
      (await this.collection.estimatedDocumentCount()) > 0

    // Prevent accidental bootstrapping if the collection is already bootstrapped
    if (isAlreadyBootstrapped && !force) {
      return null
    }

    const promises = Array(numberOfElementsToCreate)
      .fill(null)
      .map(createElement)
      .map((val) => this.create(val))

    return await Promise.all(promises)
  }

  public async create(element: T): Promise<WithId<T>> {
    const success = await this.collection.insertOne(element as OptionalId<T>)

    if (!success.acknowledged)
      throw new Error(
        `Element could not be created (name: ${element[this.keyName]})`
      )

    const result = await this.collection.findOne({
      [this.keyName]: element[this.keyName],
    } as Filter<T>)

    return result as WithId<T>
  }

  public async getOne(filter: Filter<T>): Promise<WithId<T> | null> {
    return await this.collection.findOne(filter)
  }

  public async get(filter: Filter<T>): Promise<Array<WithId<T>>> {
    return await this.collection.find(filter).toArray()
  }

  public async getById(id: ObjectId | string): Promise<WithId<T> | null> {
    return await this.collection.findOne({
      id: typeof id === 'string' ? new ObjectId(id) : id,
    })
  }

  public async updateOne(
    filter: Filter<T>,
    element: Partial<T>
  ): Promise<WithId<T>> {
    const exists = await this.getOne({
      [this.keyName]: element[this.keyName],
    } as Filter<T>)
    if (!exists) {
      throw new Error(`Element does not exist (name: ${element[this.keyName]})`)
    }

    const success = await this.collection.updateOne(
      filter,
      { $set: element },
      { upsert: false }
    )

    if (!success.acknowledged)
      throw new Error(
        `Element could not be updated (name: ${element[this.keyName]})`
      )

    return (await this.getById(success.upsertedId)) as WithId<T>
  }
}
