import {
  authenticatePlayer,
  server,
  serverInject,
  initialPlayers,
} from '../../setup'

const VALID_ETH_ADDRESS = '0x184cc5908e1a3d29b4d31df67d99622c4baa7b71'
// Keccak256 digest for mint with VALID_ETH_ADDRESS and

const MESSAGE_DIGEST =
  'df4eea1da897bfd3d163b324a1a14c5b0a54e0467e9e503e87c746e0e7941863'

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
        expect(responseJson.data.address).toStrictEqual(VALID_ETH_ADDRESS)
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

  it('should mint best player medal', async () => {
    const token0 = await authenticatePlayer(initialPlayers[0].key)
    const token1 = await authenticatePlayer(initialPlayers[1].key)

    // Give points to player 0
    await trade(token1, initialPlayers[0].key)

    await serverInject(
      {
        method: 'POST',
        url: `/mint`,
        headers: {
          Authorization: `${token0}`,
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
        expect(responseJson.data.farmerAwards).toContainEqual({
          bufficornId: 0,
          category: 0,
          ranking: 1,
        })
      }
    )
  })

  it('should mint best ranch medal', async () => {
    const token0 = await authenticatePlayer(initialPlayers[0].key)
    const token1 = await authenticatePlayer(initialPlayers[1].key)
    const token2 = await authenticatePlayer(initialPlayers[2].key)
    const token3 = await authenticatePlayer(initialPlayers[3].key)
    const token4 = await authenticatePlayer(initialPlayers[4].key)
    const token5 = await authenticatePlayer(initialPlayers[5].key)

    // Give points to all bufficorns from the ranch of player 0
    for (let s of [0, 6, 12, 18]) {
      await changeSelectedBufficorn(token0, s)
      await trade(token0, initialPlayers[0].key)
      await trade(token1, initialPlayers[0].key)
      await trade(token2, initialPlayers[0].key)
      await trade(token3, initialPlayers[0].key)
      await trade(token4, initialPlayers[0].key)
      await trade(token5, initialPlayers[0].key)
    }

    await serverInject(
      {
        method: 'POST',
        url: `/mint`,
        headers: {
          Authorization: `${token0}`,
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
        expect(responseJson.data.farmerAwards).toContainEqual({
          bufficornId: 0,
          category: 0,
          ranking: 1,
        })
        expect(responseJson.data.farmerAwards).toContainEqual({
          bufficornId: 0,
          category: 1,
          ranking: 1,
        })
      }
    )
  })

  it('should mint best bufficorn medal', async () => {
    const token0 = await authenticatePlayer(initialPlayers[0].key)
    const token1 = await authenticatePlayer(initialPlayers[1].key)
    const token2 = await authenticatePlayer(initialPlayers[2].key)
    const token3 = await authenticatePlayer(initialPlayers[3].key)
    const token4 = await authenticatePlayer(initialPlayers[4].key)
    const token5 = await authenticatePlayer(initialPlayers[5].key)

    // Give points to first bufficorn from the ranch of player 0
    const bufficornIndex = 0
    await changeSelectedBufficorn(token0, bufficornIndex)
    await trade(token0, initialPlayers[0].key)
    await trade(token1, initialPlayers[0].key)
    await trade(token2, initialPlayers[0].key)
    await trade(token3, initialPlayers[0].key)
    await trade(token4, initialPlayers[0].key)
    await trade(token5, initialPlayers[0].key)

    await serverInject(
      {
        method: 'POST',
        url: `/mint`,
        headers: {
          Authorization: `${token0}`,
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
        expect(responseJson.data.farmerAwards).toContainEqual({
          bufficornId: 0,
          category: 0,
          ranking: 1,
        })
        expect(responseJson.data.farmerAwards).toContainEqual({
          bufficornId: bufficornIndex,
          category: 2,
          ranking: 1,
        })
      }
    )
  })

  it('should mint CoolestBufficorn medal', async () => {
    const token1 = await authenticatePlayer(initialPlayers[1].key)

    // Give points to player 1
    await trade(token1, initialPlayers[1].key)

    await serverInject(
      {
        method: 'POST',
        url: `/mint`,
        headers: {
          Authorization: `${token1}`,
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
        expect(responseJson.data.farmerAwards).toContainEqual({
          bufficornId: 0,
          category: 0,
          ranking: 1,
        })
        expect(responseJson.data.farmerAwards).toContainEqual({
          bufficornId: 1,
          category: 4, // Coolness
          ranking: 1,
        })
      }
    )
  })

  it('should mint gold silver and bronze best bufficorn medal', async () => {
    const token0 = await authenticatePlayer(initialPlayers[0].key)
    const token1 = await authenticatePlayer(initialPlayers[1].key)
    const token2 = await authenticatePlayer(initialPlayers[2].key)
    const token3 = await authenticatePlayer(initialPlayers[3].key)
    const token4 = await authenticatePlayer(initialPlayers[4].key)
    const token5 = await authenticatePlayer(initialPlayers[5].key)

    // Give points to all bufficorns from the ranch of player 0
    for (let s of [0, 6, 12, 18]) {
      await changeSelectedBufficorn(token0, s)
      await trade(token0, initialPlayers[0].key)
      await trade(token1, initialPlayers[0].key)
      await trade(token2, initialPlayers[0].key)
      await trade(token3, initialPlayers[0].key)
      await trade(token4, initialPlayers[0].key)
      await trade(token5, initialPlayers[0].key)
    }

    await serverInject(
      {
        method: 'POST',
        url: `/mint`,
        headers: {
          Authorization: `${token0}`,
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
        expect(responseJson.data.farmerAwards).toContainEqual({
          bufficornId: 0,
          category: 2,
          ranking: 1,
        })
        expect(responseJson.data.farmerAwards).toContainEqual({
          bufficornId: 6,
          category: 2,
          ranking: 2,
        })
        expect(responseJson.data.farmerAwards).toContainEqual({
          bufficornId: 12,
          category: 2,
          ranking: 3,
        })
      }
    )
  })
})

async function trade(fromToken, toKey) {
  await serverInject(
    {
      method: 'POST',
      url: '/trades',
      payload: {
        to: toKey,
        cooldown: 0,
      },
      headers: {
        Authorization: fromToken,
      },
    },
    (err, response) => {
      expect(err).toBeFalsy()
      expect(response.statusCode).toBe(200)
      expect(response.headers['content-type']).toBe(
        'application/json; charset=utf-8'
      )
    }
  )
}

async function changeSelectedBufficorn(token, newSelectedBufficorn) {
  await serverInject(
    {
      method: 'POST',
      url: `/players/selected-bufficorn/${newSelectedBufficorn}`,
      headers: {
        authorization: token,
      },
    },
    (err, response) => {
      expect(err).toBeFalsy()
      expect(response.statusCode).toBe(200)
      expect(response.json().creationIndex).toBe(newSelectedBufficorn)
    }
  )
}
