import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import { BufficornRepository } from '../repositories/bufficorn'
import { PlayerRepository } from '../repositories/player'
import { RanchRepository } from '../repositories/ranch'
import {
  AuthorizationHeader,
  Player,
  Ranch,
  GetByStringKeyParams,
  JwtVerifyPayload,
  DbRanch,
  Bufficorn,
} from '../types'

const players: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  if (!fastify.mongo.db) throw Error('mongo db not found')
  const playerRepository = new PlayerRepository(fastify.mongo.db)
  const ranchRepository = new RanchRepository(fastify.mongo.db)
  const bufficornRepository = new BufficornRepository(fastify.mongo.db)

  fastify.get<{ Params: GetByStringKeyParams; Reply: Player | Error }>(
    '/auth/:key',
    {
      schema: {
        params: GetByStringKeyParams,
        headers: AuthorizationHeader,
        response: {
          200: Player,
        },
      },
      handler: async (
        request: FastifyRequest<{ Params: { key: string } }>,
        reply
      ) => {
        const { key } = request.params

        let playerId: string
        try {
          const decoded: JwtVerifyPayload = fastify.jwt.verify(
            request.headers.authorization as string
          )
          playerId = decoded.id
        } catch (err) {
          return reply.status(403).send(new Error(`Forbidden: invalid token`))
        }

        if (playerId !== key)
          return reply.status(403).send(new Error(`Forbidden: invalid token`))

        // Unreachable: valid server issued token refers to non-existent player
        const player = await playerRepository.get(key)
        if (!player) {
          return reply
            .status(404)
            .send(new Error(`Player does not exist (key: ${key})`))
        }

        // Unreachable: valid server issued token refers to an unclaimed player
        if (!player.token) {
          return reply
            .status(405)
            .send(new Error(`Player has not been claimed yet (key: ${key})`))
        }

        //GET RANCH Info

        const ranch: DbRanch = (await ranchRepository.get(
          player.ranch
        )) as DbRanch
        const ranchBufficorns: Array<Bufficorn> =
          (await bufficornRepository.getBufficornsByRanch(
            player.ranch
          )) as Array<Bufficorn>

        const ranchInfo: Ranch = {
          ...ranch,
          bufficorns: ranchBufficorns,
        }

        const extendedPlayer: Player = {
          key: player.key,
          username: player.username,
          points: player.points,
          ranch: ranchInfo,
          lastTradeIn: player.lastTradeIn,
          lastTradeOut: player.lastTradeOut,
          medals: player.medals,
        }
        return reply.status(200).send(extendedPlayer)
      },
    }
  )
}

export default players
