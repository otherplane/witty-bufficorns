import { FastifyPluginAsync, FastifyRequest } from 'fastify'

import {
  AuthorizationHeader,
  JwtVerifyPayload,
  TradeHistoryParams,
  TradeHistoryResponse,
} from '../types'

const tradeHistory: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  if (!fastify.mongo.db) throw Error('mongo db not found')

  const { playerModel, tradeModel } = fastify

  // GET /trades?limit=LIMIT&offset=OFFSET
  fastify.get<{
    Querystring: TradeHistoryParams
    Reply: TradeHistoryResponse | Error
  }>('/trades', {
    schema: {
      querystring: TradeHistoryParams,
      headers: AuthorizationHeader,
      response: {
        200: TradeHistoryResponse,
      },
    },
    handler: async (
      request: FastifyRequest<{ Querystring: TradeHistoryParams }>,
      reply
    ) => {
      // Check 1: token is valid
      let fromKey: string
      try {
        const decoded: JwtVerifyPayload = fastify.jwt.verify(
          request.headers.authorization as string
        )
        fromKey = decoded.id
      } catch (err) {
        return reply.status(403).send(new Error(`Forbidden: invalid token`))
      }

      // Check 2 (unreachable): valid server issued token refers to non-existent player
      const player = await playerModel.get(fromKey)
      if (!player) {
        return reply
          .status(404)
          .send(new Error(`Player does not exist (key: ${fromKey})`))
      }

      // Check 3 (unreachable): trading player has been claimed
      if (!player.token) {
        return reply
          .status(409)
          .send(new Error(`Player should be claimed before trade with others`))
      }

      return reply.status(200).send({
        // TODO: sort using database calls
        trades: (await tradeModel.getAllByPlayer(player.username)).sort(
          (a, b) => b.timestamp - a.timestamp
        ),
      })
    },
  })
}

export default tradeHistory
