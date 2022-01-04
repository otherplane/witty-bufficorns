import { FastifyPluginAsync, FastifyRequest } from 'fastify'

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

  const { playerModel, ranchModel, bufficornModel } = fastify

  fastify.get<{ Params: GetByStringKeyParams; Reply: Player | Error }>(
    '/players/:key',
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
        let playerKey: string
        try {
          const decoded: JwtVerifyPayload = fastify.jwt.verify(
            request.headers.authorization as string
          )
          playerKey = decoded.id
        } catch (err) {
          return reply.status(403).send(new Error(`Forbidden: invalid token`))
        }
        if (playerKey !== key)
          return reply.status(403).send(new Error(`Forbidden: invalid token`))

        // Unreachable: valid server issued token refers to non-existent player
        const player = await playerModel.get(key)
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
        const ranch: DbRanch = (await ranchModel.get(player.ranch)) as DbRanch

        const ranchBufficorns: Array<Bufficorn> =
          (await bufficornModel.getBufficornsByRanch(
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
