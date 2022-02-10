import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import keccak from 'keccak'
import secp256k1 from 'secp256k1'
import Web3 from 'web3'

import {
  PLAYER_MINT_TIMESTAMP,
  MINT_PRIVATE_KEY,
  RANCH_TO_INDEX,
  WEB3_PROVIDER,
  WITMON_ERC721_ADDRESS,
} from '../constants'
import { Bufficorn } from '../domain/bufficorn'
import { Ranch } from '../domain/ranch'
import { Player } from '../domain/player'
import {
  AuthorizationHeader,
  JwtVerifyPayload,
  MintOutput,
  MintParams,
  Trait,
} from '../types'
import {
  fromHexToUint8Array,
  isTimeToMint,
  groupBufficornsByRanch,
} from '../utils'

const WITTY_BUFFICORNS_ERC721_ABI = require('../assets/WittyBufficornsABI.json')

const mint: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  if (!fastify.mongo.db) throw Error('mongo db not found')
  const { bufficornModel, playerModel, ranchModel } = fastify

  fastify.post<{ Body: MintParams; Reply: MintOutput | Error }>('/mint', {
    schema: {
      body: MintParams,
      headers: AuthorizationHeader,
      response: {
        200: MintOutput,
      },
    },
    handler: async (request: FastifyRequest<{ Body: MintParams }>, reply) => {
      // Check 0: incubation period
      if (PLAYER_MINT_TIMESTAMP && !isTimeToMint())
        return reply
          .status(403)
          .send(new Error(`Forbidden: mint is not enabled yet`))

      // Check 1: token is valid
      let key: string
      try {
        const decoded: JwtVerifyPayload = fastify.jwt.verify(
          request.headers.authorization as string
        )
        key = decoded.id
      } catch (err) {
        return reply.status(403).send(new Error(`Forbidden: invalid token`))
      }

      // Unreachable: valid server issued token refers to non-existent player
      const player = await playerModel.get(key)
      if (!player) {
        return reply
          .status(404)
          .send(new Error(`Player does not exist (key: ${key})`))
      }

      // Check 3 (unreachable): incubating player egg has been claimed
      if (!player.token) {
        return reply
          .status(405)
          .send(new Error(`Player has not been claimed yet (key: ${key})`))
      }

      // Check 4 (unreachable): player must have database id
      if (!player.id) {
        return reply
          .status(405)
          .send(new Error(`Player has no id (key: ${key})`))
      }

      const web3 = new Web3(new Web3.providers.HttpProvider(WEB3_PROVIDER))
      // Check address is valid
      if (!web3.utils.isAddress(request.body.address)) {
        return reply
          .status(409)
          .send(new Error(`Mint address should be a valid Ethereum addresss`))
      }

      // Fetch metadata from contract using Web3
      const abi = WITTY_BUFFICORNS_ERC721_ABI

      const contract = new web3.eth.Contract(abi, WITMON_ERC721_ADDRESS)
      // TODO: ranch id goes from 0 to 5, ensure compatibility with solidity
      const ranchId = RANCH_TO_INDEX[player.ranch]

      let callResult
      try {
        callResult = await contract.methods.getRanchWeather(ranchId).call()
      } catch (err) {
        console.error(err)
        return reply
          .status(404)
          .send(new Error(`Error calling getRanchWeather method from contract`))
      }

      /* Returns: (
            uint256 _lastTimestamp,
            string memory _lastDescription
        )
        */
      const ranchWeather = callResult[1]
      console.log('ranch weather', ranchWeather)
      // TODO: we should cache the result to avoid useless calls to web3.
      // But, the weather can change, so we cannot simply cache it.
      // Possible solution: cache for 24 hours only, or manually delete the cache every time the weather changes

      // Build message to sign
      // Fake values for testing
      /*
      const ranchId = 0
      const farmerId = 7
      const farmerScore = 12345
      const farmerName = 'farmer.7'
      const farmerAwards = [
        {
          category: 0,
          ranking: 1,
          bufficornId: 0,
        },
        {
          category: 1,
          ranking: 3,
          bufficornId: 0,
        },
      ]
       */
      //enum Awards {
      //* 0 => */ BestBreeder,
      //* 1 => */ BestRanch,

      //* 2 => */ BestBufficorn,

      //* 3 => */ WarmestBufficorn,
      //* 4 => */ CoolestBufficorn,
      //* 5 => */ SmartestBufficorn,
      //* 6 => */ FastestBufficorn,
      //* 7 => */ MostEnduringBufficorn,
      //* 8 => */ MostVigorousBufficorn
      //}
      const farmerId = player.creationIndex
      const farmerScore = player.points
      const farmerName = player.username
      let farmerAwards = []

      const players: Array<Player> = await playerModel.getAllRegistered()
      const sortedPlayers = Player.getLeaderboard(
        players,
        players.length
      ).players
      for (let topPlayer of sortedPlayers) {
        if (topPlayer.username === player.username) {
          farmerAwards.push({
            category: 0,
            ranking: topPlayer.position + 1,
            bufficornId: 0,
          })
          break
        }
      }

      const bufficorns: Array<Bufficorn> = await bufficornModel.getAll()
      const bufficornsByRanch = groupBufficornsByRanch(bufficorns)
      const ranches: Array<Ranch> = (await ranchModel.getAll()).map((r) => {
        r.addBufficorns(bufficornsByRanch[r.name])
        return r
      })
      const sortedRanches = Ranch.getLeaderboard(ranches)
      const top3SortedRanches = sortedRanches.splice(0, 3)
      for (let topRanch of top3SortedRanches) {
        if (topRanch.name === player.ranch) {
          farmerAwards.push({
            category: 1,
            ranking: topRanch.position + 1,
            bufficornId: 0,
          })
          break
        }
      }

      // Iterate over all the traits and get corresponding medals
      for (const [categoryIndex, category] of [
        // undefined will get the leaderboard sorted according to how balanced are the bufficorns
        undefined,
        Trait.Coat,
        Trait.Coolness,
        Trait.Intelligence,
        Trait.Speed,
        Trait.Stamina,
        Trait.Vigor,
      ].entries()) {
        const sortedBufficorns = Bufficorn.getLeaderboard(bufficorns, category)
        const top3SortedBufficorns = sortedBufficorns.splice(0, 3)
        for (let topBufficorn of top3SortedBufficorns) {
          if (topBufficorn.ranch === player.ranch) {
            farmerAwards.push({
              category: 2 + categoryIndex,
              ranking: topBufficorn.position + 1,
              bufficornId: topBufficorn.creationIndex,
            })
          }
        }
      }

      const message = web3.eth.abi.encodeParameters(
        [
          'address',
          'uint256',
          'uint256',
          'uint256',
          'string',
          {
            'WittyBufficorns.Award[]': {
              category: 'uint8',
              ranking: 'uint256',
              bufficornId: 'uint256',
            },
          },
        ],
        [
          request.body.address,
          ranchId,
          farmerId,
          farmerScore,
          farmerName,
          farmerAwards,
        ]
      )

      if (!message) {
        throw Error('Mint failed because signature message is empty')
      }

      // Compute Keccak256 from data
      const messageBuffer = Buffer.from(message.substring(2), 'hex')
      const messageHash = keccak('keccak256').update(messageBuffer).digest()

      // Sign message
      // Note: web3.eth.accounts.sign is not used because it prefixes the message to sign
      const signatureObj = secp256k1.ecdsaSign(
        messageHash,
        fromHexToUint8Array(MINT_PRIVATE_KEY)
      )
      // `V` signature component (V = 27 + recid)
      const signV = (27 + signatureObj.recid).toString(16)
      // Signature = RS | V
      const signature = Buffer.from(signatureObj.signature)
        .toString('hex')
        .concat(signV)

      const response = {
        envelopedSignature: {
          message: message.substring(2),
          messageHash: messageHash.toString('hex'),
          signature,
        },
        data: {
          address: request.body.address,
          ranchId,
          farmerId,
          farmerScore,
          farmerName,
          farmerAwards,
        },
      }

      return reply.status(200).send(response)
    },
  })
}

export default mint
