import { CollectionInfo, Db, MongoClient } from 'mongodb'
import Fastify from 'fastify'
import { app } from '../src/app'
import { FastifyInstance } from 'fastify'

let server: FastifyInstance

let client = new MongoClient(process.env.MONGO_URI)
let db: Db

beforeAll(async () => {
  client = await client.connect()
  db = await client.db(process.env.MONGO_INITDB_DATABASE)
})

beforeEach(async () => {
  // Drop mongodb collections
  try {
    const collections = await db.listCollections()
    let info: CollectionInfo | null

    while (await collections.hasNext()) {
      info = await collections.next()
      if (info) {
        await db.dropCollection(info.name)
      }
    }
  } catch (err) {
    console.error('Error dropping mongo', err)
  }

  server = Fastify().register(app)
})

afterAll(async () => {
  await client.close()
})

afterEach(async () => {
  await server.close()
})

export { server }
