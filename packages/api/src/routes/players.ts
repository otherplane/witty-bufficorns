import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import { Bufficorn } from '../domain/bufficorn'
import { Ranch } from '../domain/ranch'
import { SvgService } from '../svgService'

import {
  AuthorizationHeader,
  BonusParams,
  BonusReply,
  ExtendedPlayerVTO,
  FarmerAward,
  GetByStringKeyParams,
  JwtVerifyPayload,
  PreviewParams,
  PreviewReply,
  RanchName,
  SelectBufficornParams,
  SelectBufficornReply,
  Trait,
  PreviewImageNameReply,
} from '../types'
import {
  groupBufficornsByRanch,
  isMainnetTime,
  getBestBufficornAwards,
  getBestFarmerAward,
  getBestRanchAward,
} from '../utils'
import { Player } from '../domain/player'

const players: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  if (!fastify.mongo.db) throw Error('mongo db not found')

  const { playerModel, ranchModel, bufficornModel } = fastify

  fastify.get<{
    Params: GetByStringKeyParams
    Reply: ExtendedPlayerVTO | Error
  }>('/players/:key', {
    schema: {
      params: GetByStringKeyParams,
      headers: AuthorizationHeader,
      response: {
        200: ExtendedPlayerVTO,
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

      if (player.isBonusPlayer()) {
        return reply.status(200).send(
          await player.toExtendedPlayerVTO(null, {
            // get last incoming trade
            lastTradeIn: await fastify.tradeModel.getLast({
              to: player.username,
              mainnetFlag: isMainnetTime(),
            }),
            // get last outgoing trade
            lastTradeOut: await fastify.tradeModel.getLast({
              from: player.username,
              mainnetFlag: isMainnetTime(),
            }),
          })
        )
      }
      //GET RANCH Info
      const ranch: Ranch = (await ranchModel.getByName(
        player.ranch as RanchName
      )) as Ranch

      const ranchBufficorns: Array<Bufficorn> =
        (await bufficornModel.getBufficornsByRanch(
          player.ranch
        )) as Array<Bufficorn>

      ranch.addBufficorns(ranchBufficorns)
      const p = await player.toExtendedPlayerVTO(ranch, {
        // get last incoming trade
        lastTradeIn: await fastify.tradeModel.getLast({
          to: player.username,
          mainnetFlag: isMainnetTime(),
        }),
        // get last outgoing trade
        lastTradeOut: await fastify.tradeModel.getLast({
          from: player.username,
          mainnetFlag: isMainnetTime(),
        }),
      })
      console.log('player', p)
      // return extended player
      return reply.status(200).send(p)
    },
  })

  fastify.post<{
    Params: SelectBufficornParams
    Reply: SelectBufficornReply | Error
  }>('/players/selected-bufficorn/:creationIndex', {
    schema: {
      params: SelectBufficornParams,
      headers: AuthorizationHeader,
      response: {
        200: SelectBufficornParams,
      },
    },
    handler: async (
      request: FastifyRequest<{ Params: SelectBufficornParams }>,
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

      if (player.isBonusPlayer()) {
        return reply
          .status(403)
          .send(new Error(`Bonus player is not allowed to receive funds`))
      }

      const creationIndex = request.params.creationIndex

      // Check 3: bufficorn belong to player's ranch
      try {
        // is player.ranch is not RanchName error is returned above
        Ranch.checkIfBufficornsBelongToRanch(
          [creationIndex],
          player.ranch as RanchName
        )
      } catch (err) {
        return reply.status(404).send(err as Error)
      }

      const updatedPlayer = await playerModel.updateSelectedBufficorn(
        player.username,
        creationIndex
      )

      if (!updatedPlayer) {
        return reply
          .status(404)
          .send(new Error(`Bufficorn ${creationIndex} couldn't be selected`))
      }

      return reply.status(200).send({ creationIndex })
    },
  })

  fastify.post<{
    Body: BonusParams
    Reply: BonusReply | Error
  }>('/players/bonus', {
    schema: {
      body: BonusParams,
      headers: AuthorizationHeader,
      response: {
        200: BonusReply,
      },
    },
    handler: async (request: FastifyRequest<{ Body: BonusParams }>, reply) => {
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

      const poapUrl = request.body.url

      // TODO: real validate poap url
      if (!fastify.poapValidator.isValid(poapUrl)) {
        return reply.status(403).send(new Error(`Invalid POAP`))
      }
      if (player.scannedBonuses.includes(poapUrl)) {
        return reply.status(403).send(new Error(`POAP already claimed`))
      }

      // Valid POAP: add to scannedBonuses, increment bonusEndsAt, and store to database
      player.scannedBonuses.push(poapUrl)
      const currentTimestamp = Date.now()
      player.addBonusTime(currentTimestamp)
      // Save to DB
      playerModel.updateBonuses(
        player.username,
        player.scannedBonuses,
        player.bonusEndsAt
      )

      return reply.status(200).send({ bonusEndsAt: player.bonusEndsAt })
    },
  })

  fastify.get<{
    Querystring: PreviewParams
    Reply: PreviewImageNameReply | Error
  }>('/players/preview', {
    schema: {
      querystring: PreviewParams,
      headers: AuthorizationHeader,
      response: {
        200: PreviewImageNameReply,
      },
    },
    handler: async (request, reply) => {
      console.log('---PREVIEW---')
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

      // Get raw info
      const players: Array<Player> = await playerModel.getAllRegistered()
      const bufficorns: Array<Bufficorn> = await bufficornModel.getAll()
      const bufficornsByRanch = groupBufficornsByRanch(bufficorns)
      const ranches: Array<Ranch> = (await ranchModel.getAll()).map((r) => {
        r.addBufficorns(bufficornsByRanch[r.name])
        return r
      })

      let farmerAwards: Array<FarmerAward> = []

      // Get farmer award
      const sortedPlayers = Player.getLeaderboard(
        players,
        players.length
      ).players
      console.log('--sortedplayers---', sortedPlayers)
      farmerAwards = getBestFarmerAward(player.username, sortedPlayers).concat(
        farmerAwards
      )

      // Update best ranch award
      const top3Ranches = Ranch.top3(ranches)
      farmerAwards = getBestRanchAward(player.ranch, top3Ranches).concat(
        farmerAwards
      )

      const bufficornTraits = [
        // undefined will get the leaderboard sorted according to how balanced are the bufficorns
        undefined,
        Trait.Coat,
        Trait.Coolness,
        Trait.Intelligence,
        Trait.Speed,
        Trait.Stamina,
        Trait.Vigor,
      ]

      // Iterate over all the traits and get corresponding medal
      for (const [categoryIndex, category] of bufficornTraits.entries()) {
        const top3Bufficorns = Bufficorn.top3(bufficorns, category)
        farmerAwards = getBestBufficornAwards(
          player.ranch,
          top3Bufficorns,
          categoryIndex
        ).concat(farmerAwards)
      }
      const svgAwardsNames: Array<string> = farmerAwards.map(
        (award: FarmerAward): string => {
          return SvgService.getSvgName({
            category: award.category,
            ranking: award.ranking,
          })
        }
      )
      return reply.status(200).send(svgAwardsNames)
    },
  })

  fastify.get<{
    Params: PreviewParams
    Reply: PreviewReply | Error
  }>('/players/images', {
    schema: {
      params: PreviewParams,
      headers: AuthorizationHeader,
      response: {
        200: PreviewReply,
      },
    },
    handler: async (request, reply) => {
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

      // Get raw info
      const players: Array<Player> = await playerModel.getAllRegistered()
      const bufficorns: Array<Bufficorn> = await bufficornModel.getAll()
      const bufficornsByRanch = groupBufficornsByRanch(bufficorns)
      const ranches: Array<Ranch> = (await ranchModel.getAll()).map((r) => {
        r.addBufficorns(bufficornsByRanch[r.name])
        return r
      })

      const farmerAwards: Array<FarmerAward> = []

      // Get farmer award
      const sortedPlayers = Player.getLeaderboard(
        players,
        players.length
      ).players
      getBestFarmerAward(player.username, sortedPlayers).concat(farmerAwards)

      // Update best ranch award
      const top3Ranches = Ranch.top3(ranches)
      getBestRanchAward(player.ranch, top3Ranches).concat(farmerAwards)

      const bufficornTraits = [
        // undefined will get the leaderboard sorted according to how balanced are the bufficorns
        undefined,
        Trait.Coat,
        Trait.Coolness,
        Trait.Intelligence,
        Trait.Speed,
        Trait.Stamina,
        Trait.Vigor,
      ]

      // Iterate over all the traits and get corresponding medal
      for (const [categoryIndex, category] of bufficornTraits.entries()) {
        const top3Bufficorns = Bufficorn.top3(bufficorns, category)
        getBestBufficornAwards(
          player.ranch,
          top3Bufficorns,
          categoryIndex
        ).concat(farmerAwards)
      }

      // return extended player
      return reply.status(200).send(farmerAwards)
    },
  })
}

export default players
