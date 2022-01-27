import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import keccak from 'keccak'
import secp256k1 from 'secp256k1'
import Web3 from 'web3'

import {
  PLAYER_MINT_TIMESTAMP,
  MINT_PRIVATE_KEY,
  RANCH_TO_INDEX,
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

const mint: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  if (!fastify.mongo.db) throw Error('mongo db not found')
  const { bufficornModel, playerModel, ranchModel, mintModel } = fastify

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

      if (player.ranch === 'WITNET_RANCH') {
        return reply
          .status(403)
          .send(new Error(`Bonus player cannot be minted`))
      }
      // TODO: get extendedPlayer using route /players/:key?
      // Instead of two separate calls to playerModel.get and ranchModel.get
      //GET RANCH Info
      const ranch: Ranch = (await ranchModel.getByName(player.ranch)) as Ranch

      // If previously minted, reply with same mint output
      const prevMint = await mintModel.get(player.id)
      if (prevMint) {
        return reply.status(200).send(prevMint)
      }

      const web3 = new Web3()
      // Check address is valid
      if (!web3.utils.isAddress(request.body.address)) {
        return reply
          .status(409)
          .send(new Error(`Mint address should be a valid Ethereum addresss`))
      }

      // Build message to sign
      /*
        function mintFarmerAwards(
            address _tokenOwner,
            uint256 _ranchId,
            uint256 _farmerId,
            uint256 _farmerScore,
            string memory _farmerName,
            WittyBufficorns.Award[] calldata _farmerAwards,
            bytes memory _signature
        )
        public
        virtual override
        nonReentrant
        inStatus(WittyBufficorns.Status.Awarding)
    {
       */
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
      /*
      enum Awards {
          BestBreeder,
          BestRanch,

          BestBufficorn,
          CoolestBufficorn,
          FastestBufficorn,
          MostVigorousBufficorn,
          MostEnduringBufficorn,
          MostAgileBufficorn,
          WarmestBufficorn
      }
       */
      const ranchId = RANCH_TO_INDEX[player.ranch]
      const farmerId = player.creationIndex
      const farmerScore = player.points
      const farmerName = player.username
      let farmerAwards = []

      const players: Array<Player> = await playerModel.getAllRegistered()
      const sorted_players = Player.getLeaderboard(
        players,
        players.length
      ).players
      for (let topPlayer of sorted_players) {
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
      const sorted_ranches = Ranch.getLeaderboard(ranches)
      const top_3_sorted_ranches = sorted_ranches.splice(0, 3)
      // TODO: test BestRanch medal
      for (let topRanch of top_3_sorted_ranches) {
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
        undefined,
        Trait.Coolness,
        Trait.Speed,
        Trait.Vigor,
        Trait.Stamina,
        // TODO: check medal order after intelligence rename
        Trait.Intelligence,
        Trait.Coat,
      ].entries()) {
        const sorted_bufficorns = Bufficorn.getLeaderboard(bufficorns, category)
        const top_3_sorted_bufficorns = sorted_bufficorns.splice(0, 3)
        // TODO: add test with multiple medals
        for (let topBufficorn of top_3_sorted_bufficorns) {
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

      // Save mint output for future requests
      await mintModel.create(response, player.id)

      return reply.status(200).send(response)
    },
  })
}

export default mint
