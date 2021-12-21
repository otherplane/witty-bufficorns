import { FastifyPluginAsync, FastifyRequest } from 'fastify'

import { EggRepository } from '../repositories/egg'
import {
  AuthorizationHeader,
  Egg,
  GetByStringKeyParams,
  JwtVerifyPayload,
} from '../types'

const eggs: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  if (!fastify.mongo.db) throw Error('mongo db not found')
  const eggRepository = new EggRepository(fastify.mongo.db)

  fastify.get<{ Params: GetByStringKeyParams; Reply: Egg | Error }>(
    '/eggs/:key',
    {
      schema: {
        params: GetByStringKeyParams,
        headers: AuthorizationHeader,
        response: {
          200: Egg,
        },
      },
      handler: async (
        request: FastifyRequest<{ Params: { key: string } }>,
        reply
      ) => {
        const { key } = request.params

        let eggId: string
        try {
          const decoded: JwtVerifyPayload = fastify.jwt.verify(
            request.headers.authorization as string
          )
          eggId = decoded.id
        } catch (err) {
          return reply.status(403).send(new Error(`Forbidden: invalid token`))
        }

        if (eggId !== key)
          return reply.status(403).send(new Error(`Forbidden: invalid token`))

        // Unreachable: valid server issued token refers to non-existent egg
        const egg = await eggRepository.get(key)
        if (!egg) {
          return reply
            .status(404)
            .send(new Error(`Egg does not exist (key: ${key})`))
        }

        // Unreachable: valid server issued token refers to an unclaimed egg
        if (!egg.token) {
          return reply
            .status(405)
            .send(new Error(`Egg has not been claimed yet (key: ${key})`))
        }

        const extendedEgg: Egg = {
          index: egg.index,
          key: egg.key,
          username: egg.username,
        }

        return reply.status(200).send(extendedEgg)
      },
    }
  )
}

export default eggs
