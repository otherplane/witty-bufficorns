import { MongoClient } from 'mongodb'
import Fastify from 'fastify'
import { app } from '../src/app'
import { FastifyInstance } from 'fastify'

let server: FastifyInstance

let client = new MongoClient(process.env.MONGO_URI)
let db

beforeAll(async () => {
  client = await client.connect()
  db = await client.db(process.env.MONGO_INITDB_DATABASE)
  // // Drop mongodb collections
  // try {
  //   await db
  //     .listCollections()
  //     .next(async (err, info) => {
  //       console.log('info11', info)
  //       if (info) {
  //         console.log(info.name)
  //         await db.collection(info.name).drop()
  //       }
  //     })
  // } catch (err) {
  //   console.error('Error dropping mongo', err)
  // }
  // await db.listCollections().next(async (err, info) => {console.log('info22', info.name)})
  // server = Fastify().register(app)
})

beforeEach(async () => {
  // Drop mongodb collections
  try {
    await db
      .listCollections()
      .next(async (err, info) => {
        if (info) {
          await db.collection(info.name).drop()
        }
      })
  } catch (err) {
    console.error('Error dropping mongo', err)
  }
  server = Fastify().register(app)
})

const VALID_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVmMTJlZmJkNzY1ZjlhZDMiLCJpYXQiOjE2NDA3MDk3MDZ9.zELplBcL_FpGy795eEaT7JWp6-sncgVH9JhR7mcVp0I'
const INVALID_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.oxyzcdaeImVmMTJlZmJkNzY1ZjlhZDMiLCJpYXQiOjE2NDA3MDk3MDZ9.zELplBcL_FpGy795eEaT7JWp6-sncgVH9JhR7mcVp0I'

afterAll(async () => {
  await client.close()
})

afterEach(async () => {
  await server.close()
})

async function authenticatePlayer(key): Promise<string> {
  return new Promise((resolve) => {
    server.inject(
      {
        method: 'POST',
        url: '/auth',
        payload: { key },
      },
      (err, response) => {
        resolve(response.json().token)
      }
    )
  })
}

export { server, VALID_TOKEN, INVALID_TOKEN, authenticatePlayer }
