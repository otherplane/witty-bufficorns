import { FastifyPluginAsync, FastifyRequest } from 'fastify'

import { DbPlayerVTO, LeaderboardParams, LeaderboardResponse } from '../types'
import { Ranch } from '../domain/ranch'
import { Bufficorn } from '../domain/bufficorn'

const leaderboard: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  if (!fastify.mongo.db) throw Error('mongo db not found')

  const { playerModel, ranchModel, bufficornModel } = fastify

  //GET /leaderboard?resource=RESOURCE&limit=LIMIT&offset=OFFSET&filter=STAT
  fastify.get<{
    Params: LeaderboardParams
    Reply: LeaderboardResponse | Error
  }>('/leaderboard', {
    schema: {
      params: LeaderboardParams,
      response: {
        200: LeaderboardResponse,
      },
    },
    handler: async (
      request: FastifyRequest<{ Params: LeaderboardParams }>,
      reply
    ) => {
      // TODO: Use resource from LeaderBoardParams as a trait in getLeaderboard functions
      const bufficorns: Array<Bufficorn> = await bufficornModel.getAll()
      const sorted_bufficorns = Bufficorn.getLeaderboard(bufficorns)

      const ranches: Array<Ranch> = await ranchModel.getAll()
      const sorted_ranches = Ranch.getLeaderboard(ranches)

      const players: Array<DbPlayerVTO> = await playerModel.getLeaderboard()

      const leaderboardResponse: LeaderboardResponse = {
        bufficorns: sorted_bufficorns,
        ranches: sorted_ranches,
        players,
      }

      return reply.status(200).send(leaderboardResponse)
    },
  })
}

export default leaderboard
