import Ajv from 'ajv'
import AutoLoad, { AutoloadPluginOptions } from 'fastify-autoload'
import fastifyJwt from 'fastify-jwt'
import { FastifyPluginAsync } from 'fastify'
import { fastifyMongodb } from 'fastify-mongodb'
import { join } from 'path'

import { PLAYERS_COUNT, JWT_SECRET, MONGO_URI } from './constants'
import { PlayerRepository } from './repositories/player'
import { BufficornRepository } from './repositories/bufficorn'
import { RanchRepository } from './repositories/ranch'

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  // TODO: Add HTTPS support
  // {
  //   https: {
  //     key: fs.readFileSync(path.join(__dirname, 'key.pem')),
  //     cert: fs.readFileSync(path.join(__dirname, 'cert.pem'))
  //   }
  // }

  // Json Validator
  const ajv = new Ajv({
    removeAdditional: true,
    useDefaults: true,
    coerceTypes: 'array',
    allErrors: true,
  })
  // Support ajv@7
  ajv.addKeyword('kind')
  ajv.addKeyword('modifier')
  fastify.setValidatorCompiler(({ schema }) => {
    return ajv.compile(schema)
  })

  // MongoDB
  fastify.register(fastifyMongodb, {
    // force to close the mongodb connection when app stopped
    forceClose: true,
    url: MONGO_URI,
  })

  // Initialize game repositories
  fastify.register(async (fastify, options, next) => {
    if (!fastify.mongo.db) throw Error('mongo db not found')

    // Initialize game repositories and bootstrap
    const playerRepository = new PlayerRepository(fastify.mongo.db)
    const ranchRepository = new RanchRepository(fastify.mongo.db)
    const bufficornRepository = new BufficornRepository(fastify.mongo.db)
    await playerRepository.bootstrap(PLAYERS_COUNT, false)
    await ranchRepository.bootstrap(false)
    await bufficornRepository.bootstrap(false)

    next()
  })

  // CORS
  fastify.register(require('fastify-cors'), {
    origin: '*',
    methods: ['GET', 'POST'],
  })

  // JWT
  fastify.register(fastifyJwt, {
    secret: JWT_SECRET as string,
  })

  // Plugins defined in routes
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: opts,
  })

  fastify.register(require('fastify-static'), {
    root: join(__dirname, '../public'),
    // prefix: '/public/', // optional: default '/'
  })
}

export default app
export { app }
