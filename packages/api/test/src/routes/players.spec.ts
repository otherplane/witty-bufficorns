import {
  server,
  VALID_TOKEN,
  INVALID_TOKEN,
  authenticatePlayer,
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
  it('should NOT get PLAYER #1 - no authorization header', (done) => {
    server.inject(
      {
        method: 'GET',
        url: `/auth/${initialPlayers[0].key}`,
      },
      (err, response) => {
        expect(response?.json().message).toBe(
          `headers should have required property 'authorization'`
        )
        done()
      }
    )
  })
  it('should NOT get PLAYER #1 - invalid jwt token', (done) => {
    server.inject(
      {
        method: 'GET',
        url: `/auth/${initialPlayers[0].key}`,
        headers: {
          Authorization: INVALID_TOKEN,
        },
      },
      (err, response) => {
        expect(response?.json().message).toBe('Forbidden: invalid token')
        done()
      }
    )
  })
  it('should get PLAYER #1 - get after claimed', async () => {
    await authenticatePlayer(initialPlayers[0].key)

    server.inject(
      {
        method: 'GET',
        url: `/auth/${initialPlayers[0].key}`,
        headers: {
          Authorization: VALID_TOKEN,
        },
      },
      (err, response) => {
        console.log('error---get info-->', response.json())
        // const {
        //   key,
        //   username,
        //   ranch,
        //   points,
        //   lastTradeIn,
        //   lastTradeOut,
        //   medals,
        // } = response.json()

        // expect(key).toBeTruthy()
        // expect(username).toBeTruthy()
        // expect(ranch).toBeTruthy()
        // expect(points).toBeTruthy()
        // expect(lastTradeIn).toBeTruthy()
        // expect(lastTradeOut).toBeTruthy()
        // expect(medals).toBeTruthy()
      }
    )
  })
})
