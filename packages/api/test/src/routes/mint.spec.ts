import {
  authenticatePlayer,
  server,
  serverInject,
  initialPlayers,
} from '../../setup'

const VALID_ETH_ADDRESS = '0x184cc5908e1a3d29b4d31df67d99622c4baa7b71'
// Keccak256 digest for mint with VALID_ETH_ADDRESS and

const MESSAGE_DIGEST =
  'c2f96088acd44ff806e7806c5f3d101e4cd06bc98d8e85eb854d9cc9878c1890'

const INVALID_ETH_ADDRESS_1 = '0x00'
const INVALID_ETH_ADDRESS_2 = 'foo'

describe('mint.ts', () => {
  it('should mint a claimed egg', async () => {
    const token = await authenticatePlayer(initialPlayers[0].key)

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
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
        const responseJson = response?.json()
        expect(responseJson.envelopedSignature).toBeTruthy()
        expect(responseJson.envelopedSignature.message).toBeTruthy()
        expect(responseJson.envelopedSignature.signature).toBeTruthy()
        expect(responseJson.envelopedSignature.messageHash).toBe(MESSAGE_DIGEST)
        expect(responseJson.data).toStrictEqual({
          address: VALID_ETH_ADDRESS,
          playerMedals: [],
          points: 0,
          ranchMedals: [],
        })
      }
    )
  })

  it('should NOT mint an egg with invalid address', async () => {
    const token = await authenticatePlayer(initialPlayers[0].key)

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
        expect(response.statusCode).toBe(403)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
        expect(response.json().message).toBe('Forbidden: invalid token')
      }
    )
  })

  it.skip('should NOT mint an egg before the mint timestamp', async () => {
    // TODO: This test will fail because the timestamp validation is disabled (otherwise the other tests break)
    const token = await authenticatePlayer(initialPlayers[0].key)

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
    const token = await authenticatePlayer(initialPlayers[0].key)

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
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
        const responseJson = response?.json()
        expect(responseJson.envelopedSignature).toBeTruthy()
        expect(responseJson.envelopedSignature.message).toBeTruthy()
        expect(responseJson.envelopedSignature.signature).toBeTruthy()
        expect(responseJson.envelopedSignature.messageHash).toBe(MESSAGE_DIGEST)
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
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
        const responseJson = response?.json()
        expect(responseJson.envelopedSignature).toBeTruthy()
        expect(responseJson.envelopedSignature.message).toBeTruthy()
        expect(responseJson.envelopedSignature.signature).toBeTruthy()
        expect(responseJson.envelopedSignature.messageHash).toBe(MESSAGE_DIGEST)
      }
    )
  })
})
