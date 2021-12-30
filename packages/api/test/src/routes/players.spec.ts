import {
  server,
  VALID_TOKEN,
  INVALID_TOKEN,
  authenticatePlayer,
  serverInject,
} from '../../setup'

const initialPlayers = [
  {
    key: 'ef12efbd765f9ad3',
    username: 'calm-bison',
  },
  {
    key: 'b75c34545e8cb4d2',
    username: 'particular-newt',
  },
]

describe('authentication.ts', () => {
  it('should NOT get PLAYER #1 - no authorization header', async () => {
    await serverInject(
      {
        method: 'GET',
        url: `/players/${initialPlayers[0].key}`,
      },
      (err, response) => {
        expect(response?.json().message).toBe(
          `headers should have required property 'authorization'`
        )
      }
    )
  })

  it('should NOT get PLAYER #1 - invalid jwt token', async () => {
    await serverInject(
      {
        method: 'GET',
        url: `/players/${initialPlayers[0].key}`,
        headers: {
          Authorization: INVALID_TOKEN,
        },
      },
      (err, response) => {
        expect(response?.json().message).toBe('Forbidden: invalid token')
      }
    )
  })

  it('should get PLAYER #1 - get after claimed', async () => {
    await authenticatePlayer(initialPlayers[0].key)

    await serverInject(
      {
        method: 'GET',
        url: `/players/${initialPlayers[0].key}`,
        headers: {
          Authorization: VALID_TOKEN,
        },
      },
      (err, response) => {
        const {
          key,
          username,
          ranch,
          points,
          lastTradeIn,
          lastTradeOut,
          medals,
        } = response.json()

        expect(key).toBeTruthy()
        expect(username).toBeTruthy()
        expect(ranch).toBeTruthy()
        expect(points).toBe(0)
        expect(lastTradeIn).toBe(undefined)
        expect(lastTradeOut).toBe(undefined)
        expect(medals).toStrictEqual([])
      }
    )
  })
})
