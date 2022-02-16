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
      console.log('inside /metadata/:key')
      const { key } = request.params
      console.log('key', key)
      // Check if metadata already exists in DB
      const medalMetadataFromDB = await fastify.metadataModel.get(key)
      console.log('medalmetadatafromdb', medalMetadataFromDB)
      if (medalMetadataFromDB) {
        return reply.status(200).send(medalMetadataFromDB)
      }

      console.log('before init web3')
      // Fetch metadata from contract using Web3
      const web3 = new Web3(new Web3.providers.HttpProvider(WEB3_PROVIDER))
      console.log('before init contract')
      const contract = new web3.eth.Contract(
        CONTRACT_ERCC721_ABI,
        WITTY_BUFFICORNS_ERC721_ADDRESS
      )

      let callResult
      try {
        console.log('before call metadata')
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
      console.log('inside /image/:key')
      const { key } = request.params
      console.log('key', key)
      // Fetch metadata from contract using Web3
      const web3 = new Web3(new Web3.providers.HttpProvider(WEB3_PROVIDER))
      console.log('web3 initialized')
      const contract = new web3.eth.Contract(
        CONTRACT_ERCC721_ABI,
        WITTY_BUFFICORNS_ERC721_ADDRESS
      )
      console.log('contract initialized')
      let callResult

      try {
        callResult = await contract.methods.getTokenInfo(key).call()
        console.log('callresult', callResult)
      } catch (err) {
        console.error('[Server] Metadata error:', err)
        return reply
          .status(404)
          .send(new Error(`Metadata for token id ${key} could not be fetched`))
      }
      const [category, ranking]: [number, number] = callResult[0]
      console.log('callresult', callResult)
      // const category = callResult[0]
      // const ranking = callResult[1]
      console.log('before getsvg', category)
      const svgName = SvgService.getSvgName({ category, ranking })
      const svg = SvgService.getSVGFromName(svgName, ranking.toString())

      fastify.cache.setTokenIdToSVGName(
        key.toString(),
        svgName,
        ranking.toString()
      )

      console.log('svg', svg)
      return reply.status(200).send(svg)
    },
  })
}

export default metadata
