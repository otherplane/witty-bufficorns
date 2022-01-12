import {
  authenticatePlayer,
  server,
  serverInject,
  initialPlayers,
} from '../../setup'
//import { PLAYER_MINT_TIMESTAMP } from '../../../src/constants'

const VALID_ETH_ADDRESS = '0x184cc5908e1a3d29b4d31df67d99622c4baa7b71'
// Keccak256 digest for mint with VALID_ETH_ADDRESS and
// index 0, rank 1 and total eggs 2.
const MESSAGE_DIGEST =
  'c2f96088acd44ff806e7806c5f3d101e4cd06bc98d8e85eb854d9cc9878c1890'

const INVALID_ETH_ADDRESS_1 = '0x00'
const INVALID_ETH_ADDRESS_2 = 'foo'

describe('mint.ts', () => {
  it('should mint a claimed egg', async () => {
    // Before test: Claim an egg
    const token = await authenticatePlayer(initialPlayers[0].key)
    //console.log("player 0 token:", token)
    //const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVmMTJlZmJkNzY1ZjlhZDMiLCJpYXQiOjE2NDE5OTk4Njh9.vC-jGxM5tjwaRjNph98EbkP6iXZW-Ctl4ckPHx4zs9o"

    //PLAYER_MINT_TIMESTAMP = 1234

    await serverInject(
      {
        method: 'POST',
        url: `/mint`,
        headers: {
          Authorization: `${token}`,
        },
        payload: { address: VALID_ETH_ADDRESS },
      },
      (err, response) => {
        expect(err).toBeFalsy()
        //console.log(response)
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
        const responseJson = response?.json()
        expect(responseJson.envelopedSignature).toBeTruthy()
        expect(responseJson.envelopedSignature.message).toBeTruthy()
        expect(responseJson.envelopedSignature.signature).toBeTruthy()
        expect(responseJson.envelopedSignature.messageHash).toBe(MESSAGE_DIGEST)
        expect(responseJson.data).toBe({
          address: VALID_ETH_ADDRESS,
          index: 0,
          rank: 1,
          score: 1234,
          total: 2,
        })
      }
    )
  })

  it('should NOT mint an egg with invalid address', async () => {
    // Before test: Claim an egg
    const token = await authenticatePlayer(initialPlayers[0].key)

    //PLAYER_MINT_TIMESTAMP = 1234

    await serverInject(
      {
        method: 'POST',
        url: `/mint`,
        headers: {
          Authorization: `${token}`,
        },
        payload: { address: INVALID_ETH_ADDRESS_1 },
      },
      (err, response) => {
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(409)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
      }
    )

    await serverInject(
      {
        method: 'POST',
        url: `/mint`,
        headers: {
          Authorization: `${token}`,
        },
        payload: { address: INVALID_ETH_ADDRESS_2 },
      },
      (err, response) => {
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(409)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
      }
    )
  })
  it('should NOT mint an egg with an invalid token', async () => {
    const token = 'foo'

    //PLAYER_MINT_TIMESTAMP = 1234

    await serverInject(
      {
        method: 'POST',
        url: `/mint`,
        headers: {
          Authorization: `${token}`,
        },
        payload: { address: VALID_ETH_ADDRESS },
      },
      (err, response) => {
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(403) // TODO: why not 409?
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
        expect(response.json().message).toBe('Forbidden: invalid token')
      }
    )
  })
  it('should NOT mint an egg before the mint timestamp', async () => {
    // Before test: Claim an egg
    const token = await authenticatePlayer(initialPlayers[0].key)
    // TODO: This test will fail because the timestamp validation is disabled (otherwise the other tests break)

    //PLAYER_MINT_TIMESTAMP = 2045351200

    await serverInject(
      {
        method: 'POST',
        url: `/mint`,
        headers: {
          Authorization: `${token}`,
        },
        payload: { address: VALID_ETH_ADDRESS },
      },
      (err, response) => {
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(409)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
      }
    )
  })
  it('should cache mint result when called a second time', async () => {
    // Before test: Claim an egg
    const token = await authenticatePlayer(initialPlayers[0].key)
    //console.log("player 0 token:", token)
    //const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVmMTJlZmJkNzY1ZjlhZDMiLCJpYXQiOjE2NDE5OTk4Njh9.vC-jGxM5tjwaRjNph98EbkP6iXZW-Ctl4ckPHx4zs9o"

    //PLAYER_MINT_TIMESTAMP = 1234

    await serverInject(
      {
        method: 'POST',
        url: `/mint`,
        headers: {
          Authorization: `${token}`,
        },
        payload: { address: VALID_ETH_ADDRESS },
      },
      (err, response) => {
        expect(err).toBeFalsy()
        //console.log(response)
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
        const responseJson = response?.json()
        expect(responseJson.envelopedSignature).toBeTruthy()
        expect(responseJson.envelopedSignature.message).toBeTruthy()
        expect(responseJson.envelopedSignature.signature).toBeTruthy()
        expect(responseJson.envelopedSignature.messageHash).toBe(MESSAGE_DIGEST)
	/*
        expect(responseJson.data).toBe({
          address: VALID_ETH_ADDRESS,
          index: 0,
          rank: 1,
          score: INCUBATION_POINTS,
          total: 2,
        })
       */
      }
    )

    // Claim again
    await serverInject(
      {
        method: 'POST',
        url: `/mint`,
        headers: {
          Authorization: `${token}`,
        },
        payload: { address: VALID_ETH_ADDRESS },
      },
      (err, response) => {
        expect(err).toBeFalsy()
        console.log(response)
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
        const responseJson = response?.json()
        expect(responseJson.envelopedSignature).toBeTruthy()
        expect(responseJson.envelopedSignature.message).toBeTruthy()
        expect(responseJson.envelopedSignature.signature).toBeTruthy()
        expect(responseJson.envelopedSignature.messageHash).toBe(MESSAGE_DIGEST)
	/*
        expect(responseJson.data).toBe({
          address: VALID_ETH_ADDRESS,
          index: 0,
          rank: 1,
          score: 1234,
          total: 2,
        })
       */
      }
    )
  })
})
