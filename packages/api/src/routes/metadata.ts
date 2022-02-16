import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import { WEB3_PROVIDER, WITTY_BUFFICORNS_ERC721_ADDRESS } from '../constants'
import Web3 from 'web3'

//import { WEB3_PROVIDER, WITMON_ERC721_ADDRESS } from '../constants'
//import { MetadataRepository } from '../repositories/metadata'
import { MedalMetadata, GetByNumericKeyParams, SvgImage } from '../types'
import { SvgService } from '../svgService'

const CONTRACT_ERCC721_ABI = require('../assets/WittyBufficornsABI.json')

const metadata: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  if (!fastify.mongo.db) throw Error('mongo db not found')
  //const metadataRepository = new MetadataRepository(fastify.mongo.db)

  fastify.get<{
    Params: GetByNumericKeyParams
    Reply: MedalMetadata | Error
  }>('/metadata/:key', {
    schema: {
      params: GetByNumericKeyParams,
      response: {
        200: MedalMetadata,
      },
    },
    handler: async (
      request: FastifyRequest<{ Params: { key: number } }>,
      reply
    ) => {
      const { key } = request.params
      // Check if metadata already exists in DB
      const medalMetadataFromDB = await fastify.metadataModel.get(key)
      if (medalMetadataFromDB) {
        return reply.status(200).send(medalMetadataFromDB)
      }

      // Fetch metadata from contract using Web3
      const web3 = new Web3(new Web3.providers.HttpProvider(WEB3_PROVIDER))
      const contract = new web3.eth.Contract(
        CONTRACT_ERCC721_ABI,
        WITTY_BUFFICORNS_ERC721_ADDRESS
      )

      let callResult
      try {
        callResult = await contract.methods.metadata(key).call()
      } catch (err) {
        console.error('[Server] Metadata error:', err)
        return reply
          .status(404)
          .send(new Error(`Metadata for token id ${key} could not be fetched`))
      }

      // Parse contract call result
      const metadataFromContract: MedalMetadata = {
        ...JSON.parse(callResult),
      }

      // Save metadata into DB
      await fastify.metadataModel.create(metadataFromContract)

      return reply.status(200).send(metadataFromContract)
    },
  })

  fastify.get<{
    Params: GetByNumericKeyParams
    Reply: SvgImage | Error
  }>('/image/:key', {
    schema: {
      params: GetByNumericKeyParams,
      response: {
        200: SvgImage,
      },
    },
    handler: async (
      request: FastifyRequest<{ Params: { key: number } }>,
      reply
    ) => {
      const { key } = request.params
      // Fetch metadata from contract using Web3
      const web3 = new Web3(new Web3.providers.HttpProvider(WEB3_PROVIDER))
      const contract = new web3.eth.Contract(
        CONTRACT_ERCC721_ABI,
        WITTY_BUFFICORNS_ERC721_ADDRESS
      )
      let callResult

      try {
        callResult = await contract.methods.getTokenInfo(key).call()
      } catch (err) {
        console.error('[Server] Metadata error:', err)
        return reply
          .status(404)
          .send(new Error(`Metadata for token id ${key} could not be fetched`))
      }
      const [category, ranking]: [number, string] = callResult[0]
      console.log('callresult', callResult)
      // const category = callResult[0]
      // const ranking = callResult[1]
      console.log('before getsvg', category)
      const svgName = SvgService.getSvgName({
        category: Number(category),
        ranking: Number(ranking),
      })
      const svg = SvgService.getSVGFromName(svgName, ranking.toString())

      fastify.cache.setTokenIdToSVGName(
        key.toString(),
        svgName,
        ranking.toString()
      )
      return reply.status(200).send(svg)
    },
  })
}

export default metadata
