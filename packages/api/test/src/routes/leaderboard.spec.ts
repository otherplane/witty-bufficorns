import {
  TRADE_COOLDOWN_MILLIS,
  TRADE_DURATION_MILLIS,
  TRADE_POINTS,
  TRADE_POINTS_DIVISOR,
} from '../../../src/constants'
import { authenticatePlayer, initialPlayers, serverInject } from '../../setup'

describe('Route /leaderboard', () => {
  describe('should return leaderboard values for each entity', () => {
    it('bufficorns', async () => {
      const token = await authenticatePlayer(initialPlayers[0].key)

      await serverInject(
        {
          method: 'GET',
          url: '/leaderboard',
          headers: {
            Authorization: token,
          },
        },
        (err, response) => {
          const bufficorns = response.json().bufficorns
          expect(err).toBeFalsy()
          expect(response.statusCode).toBe(200)
          expect(bufficorns.length).toBe(24)

          bufficorns.forEach((bufficorn, index) => {
            expect(bufficorn.name).toBeTruthy()
            expect(bufficorn.ranch).toBeTruthy()
            expect(bufficorn.vigor).toBe(0)
            expect(bufficorn.coolness).toBe(0)
            expect(bufficorn.stamina).toBe(0)
            expect(bufficorn.speed).toBe(0)
            expect(bufficorn.coat).toBe(0)
            expect(bufficorn.agility).toBe(0)
            expect(bufficorn.score).toBe(0)
            expect(bufficorn.position).toBe(index)
          })
        }
      )
    })

    it('ranches', async () => {
      const token = await authenticatePlayer(initialPlayers[0].key)

      await serverInject(
        {
          method: 'GET',
          url: '/leaderboard',
          headers: {
            Authorization: token,
          },
        },
        (err, response) => {
          const ranches = response.json().ranches
          expect(err).toBeFalsy()
          expect(response.statusCode).toBe(200)
          expect(ranches.length).toBe(6)

          ranches.forEach((ranch, index) => {
            expect(ranch.name).toBeTruthy()
            expect(ranch.score).toBe(0)
            expect(ranch.position).toBe(index)
          })
        }
      )
    })

    it('players', async () => {
      const token = await authenticatePlayer(initialPlayers[0].key)

      await serverInject(
        {
          method: 'GET',
          url: '/leaderboard',
          headers: {
            Authorization: token,
          },
        },
        (err, response) => {
          const players = response.json().players
          expect(err).toBeFalsy()
          expect(response.statusCode).toBe(200)
          expect(players.length).toBe(10)

          players.forEach((player, index) => {
            expect(player.username).toBeTruthy()
            expect(player.points).toBe(0)
            expect(player.position).toBe(index)
          })
        }
      )
    })
  })

  describe('should return leaderboard values for each entity AFTER TRADE', () => {
    it('bufficorns', async () => {
      const token0 = await authenticatePlayer(initialPlayers[0].key)
      const token1 = await authenticatePlayer(initialPlayers[1].key)

      // Trade with player 1
      await serverInject(
        {
          method: 'POST',
          url: '/trades',
          payload: {
            to: initialPlayers[1].key,
          },
          headers: {
            Authorization: token0,
          },
        },
        (err, response) => {
          expect(response.statusCode).toBe(200)
        }
      )

      let selectedBufficorn
      // Get player information to know their selected bufficorn
      await serverInject(
        {
          method: 'GET',
          url: `/players/${initialPlayers[1].key}`,
          headers: {
            Authorization: token1,
          },
        },
        (err, response) => {
          expect(err).toBeFalsy()
          expect(response.statusCode).toBe(200)
          expect(response.headers['content-type']).toBe(
            'application/json; charset=utf-8'
          )

          selectedBufficorn = response.json().player.selectedBufficorn
        }
      )

      await serverInject(
        {
          method: 'GET',
          url: '/leaderboard',
          headers: {
            Authorization: token1,
          },
        },
        (err, response) => {
          const bufficorns = response.json().bufficorns

          expect(err).toBeFalsy()
          expect(response.statusCode).toBe(200)
          expect(bufficorns.length).toBe(24)

          const fedBufficorn = bufficorns.find(
            (b) => Number(b.index) === selectedBufficorn
          )
          // Traded ranch gives vigor
          expect(fedBufficorn.vigor).toBe(TRADE_POINTS)
        }
      )
    })

    it('ranches', async () => {
      const token0 = await authenticatePlayer(initialPlayers[0].key)
      const token1 = await authenticatePlayer(initialPlayers[1].key)

      // Trade with player 1
      await serverInject(
        {
          method: 'POST',
          url: '/trades',
          payload: {
            to: initialPlayers[1].key,
          },
          headers: {
            Authorization: token0,
          },
        },
        (err, response) => {
          expect(response.statusCode).toBe(200)
        }
      )

      let ranchName
      // Get player information to know their ranch
      await serverInject(
        {
          method: 'GET',
          url: `/players/${initialPlayers[1].key}`,
          headers: {
            Authorization: token1,
          },
        },
        (err, response) => {
          ranchName = response.json().player.ranch.name
        }
      )

      await serverInject(
        {
          method: 'GET',
          url: '/leaderboard',
          headers: {
            Authorization: token0,
          },
        },
        (err, response) => {
          const ranches = response.json().ranches
          const ranch = ranches.find((r) => r.name === ranchName)

          // TODO: ranch score is calculated with balanced bufficorn. To be able to see a value in the core of a ranch,
          // all the bufficorns of the ranch should have a traits. Is returning the lowest value of all the traits
          expect(ranch.score).toBe(0)
        }
      )
    })

    it('players', async () => {
      const token0 = await authenticatePlayer(initialPlayers[0].key)
      await authenticatePlayer(initialPlayers[1].key)

      // Trade with player 1
      await serverInject(
        {
          method: 'POST',
          url: '/trades',
          payload: {
            to: initialPlayers[1].key,
          },
          headers: {
            Authorization: token0,
          },
        },
        (err, response) => {
          expect(response.statusCode).toBe(200)
        }
      )

      await serverInject(
        {
          method: 'GET',
          url: '/leaderboard',
          headers: {
            Authorization: token0,
          },
        },
        (err, response) => {
          const players = response.json().players
          expect(err).toBeFalsy()
          expect(response.statusCode).toBe(200)
          expect(players.length).toBe(10)

          players.forEach((player, index) => {
            expect(player.username).toBeTruthy()
            if (player.username === initialPlayers[1].username) {
              expect(player.points).toBe(800)
            } else {
              expect(player.points).toBe(0)
            }
            expect(typeof player.position).toBe('number')
            expect(player.position).toBe(index)
          })
        }
      )
    })
  })

  it('should return sorted bufficorns when RESOURCE param is given', async () => {
    const token0 = await authenticatePlayer(initialPlayers[0].key)
    const token1 = await authenticatePlayer(initialPlayers[1].key)

    // Trade with player 1
    await serverInject(
      {
        method: 'POST',
        url: '/trades',
        payload: {
          to: initialPlayers[1].key,
        },
        headers: {
          Authorization: token0,
        },
      },
      (err, response) => {
        expect(response.statusCode).toBe(200)
      }
    )

    await serverInject(
      {
        method: 'GET',
        url: '/leaderboard?resource=vigor',
        headers: {
          Authorization: token1,
        },
      },
      (err, response) => {
        expect(response.statusCode).toBe(200)
        expect(response.json().bufficorns[0].vigor).toBe(TRADE_POINTS)
      }
    )
  })

  it('should return correct values when PAGINATION params are given', async () => {
    const token = await authenticatePlayer(initialPlayers[0].key)

    let firstPlayer
    await serverInject(
      {
        method: 'GET',
        url: '/leaderboard?limit=1&offset=0',
        headers: {
          Authorization: token,
        },
      },
      (err, response) => {
        expect(response.statusCode).toBe(200)
        expect(response.json().players.length).toBe(1)
        firstPlayer = response.json().players[0]
      }
    )

    await serverInject(
      {
        method: 'GET',
        url: '/leaderboard?limit=1&offset=1',
        headers: {
          Authorization: token,
        },
      },
      (err, response) => {
        expect(response.statusCode).toBe(200)
        expect(response.json().players.length).toBe(1)
        expect(response.json().players[0].username).not.toBe(
          firstPlayer.username
        )
      }
    )
  })
})
