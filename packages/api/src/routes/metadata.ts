import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import { WEB3_PROVIDER } from '../constants'
import Web3 from 'web3'

//import { WEB3_PROVIDER, WITMON_ERC721_ADDRESS } from '../constants'
//import { MetadataRepository } from '../repositories/metadata'
import {
  MedalMetadata,
  GetByNumericKeyParams,
} from '../types'

const CONTRACT_ERCC721 = require('../assets/wittyBufficornsERC721.json')

const metadata: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  if (!fastify.mongo.db) throw Error('mongo db not found')
  //const metadataRepository = new MetadataRepository(fastify.mongo.db)

  fastify.get<{
    Params: GetByNumericKeyParams
    Reply:
      MedalMetadata | Error
  }>('/metadata/:key', {
    schema: {
      params: GetByNumericKeyParams,
      response: {
        200: MedalMetadata
      },
    },
    handler: async (
      request: FastifyRequest<{ Params: { key: number } }>,
      reply
    ) => {
      const { key } = request.params

      // // Check if metadata already exists in DB
      const medalMetadataFromDB= await fastify.metadataModel.get(key)
      if (medalMetadataFromDB) {
        return reply.status(200).send(medalMetadataFromDB)
      }

      // Fetch metadata from contract using Web3
      const web3 = new Web3(new Web3.providers.HttpProvider(WEB3_PROVIDER))
      const { abi } = CONTRACT_ERCC721
      const contract = new web3.eth.Contract(abi, CONTRACT_ERCC721)

      let callResult
      try {
        callResult = await contract.methods.metadata(key).call()
      } catch (err) {
        console.error('[Server] Metadata error:', err)
        return reply
          .status(404)
          .send(
            new Error(`Metadata for token id ${key} could not be fetched`)
          )
      }

      // Parse contract call result
      const metadataFromContract: MedalMetadata = {
        ...JSON.parse(callResult),
        token_id: key,
      }

      // Save metadata into DB
      await fastify.metadataModel.create(metadataFromContract)

      return reply.status(200).send(metadataFromContract)
    },
  })
}

export default metadata
