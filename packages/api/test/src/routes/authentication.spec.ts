import { server } from '../../setup'

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
  it('should authenticate PLAYER #0', (done) => {
    server.inject(
      {
        method: 'POST',
        url: '/auth',
        payload: { key: initialPlayers[0].key },
      },
      (err, response) => {
        const { key, token, username } = response.json()

        expect(key).toBeTruthy()
        expect(token).toBeTruthy()
        expect(username).toBeTruthy()

        done()
      }
    )
  })
})
