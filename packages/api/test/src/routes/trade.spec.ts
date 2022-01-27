import {
  TRADE_COOLDOWN_MILLIS,
  TRADE_DURATION_MILLIS,
  TRADE_POINTS,
  TRADE_POINTS_DIVISOR,
} from '../../../src/constants'
import {
  authenticatePlayer,
  initialPlayers,
  serverInject,
  sleep,
} from '../../setup'

describe('Route /trade', () => {
  it('should return the trade object after trade with itself', async () => {
    let trade = null
    const token = await authenticatePlayer(initialPlayers[0].key)

    // Trade with yourself
    await serverInject(
      {
        method: 'POST',
        url: '/trades',
        payload: {
          to: initialPlayers[0].key,
        },
        headers: {
          Authorization: token,
        },
      },
      (err, response) => {
        trade = response.json()
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
        expect(response.json().to).toBe(initialPlayers[0].username)
        expect(response.json().from).toBe(initialPlayers[0].username)
        expect(response.json().timestamp).toBeTruthy()
        expect(response.json().ends).toBe(
          response.json().timestamp + TRADE_DURATION_MILLIS
        )
        expect(response.json().resource.amount).toBe(TRADE_POINTS)
        expect(response.json().resource.trait).toBe('vigor')
      }
    )

    // Get information
    await serverInject(
      {
        method: 'GET',
        url: `/players/${initialPlayers[0].key}`,
        headers: {
          Authorization: token,
        },
      },
      (err, response) => {
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
        expect(
          response
            .json()
            .player.ranch.bufficorns.find(
              (bufficorn) => bufficorn.name === 'Bufficorn-0'
            ).vigor
        ).toBe(TRADE_POINTS)
        expect(response.json().lastTradeOut).toStrictEqual(trade)
      }
    )
  })

  it('should sum points bufficorn after feed', async () => {
    const bufficornName = 'Bufficorn-1'

    const token0 = await authenticatePlayer(initialPlayers[0].key)
    const token1 = await authenticatePlayer(initialPlayers[1].key)

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
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
        expect(response.json().resource.amount).toBe(TRADE_POINTS)
        expect(response.json().resource.trait).toBe('vigor')
      }
    )

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
        const bufficorn = response
          .json()
          .player.ranch.bufficorns.find(
            (bufficorn) => bufficorn.name === bufficornName
          )
        expect(
          response
            .json()
            .player.ranch.bufficorns.find(
              (bufficorn) => bufficorn.name === bufficornName
            ).vigor
        ).toBe(TRADE_POINTS)
      }
    )
  })

  it('should sum less points if traded several times', async () => {
    const token = await authenticatePlayer(initialPlayers[0].key)
    const token1 = await authenticatePlayer(initialPlayers[1].key)

    await serverInject(
      {
        method: 'POST',
        url: '/trades',
        payload: {
          to: initialPlayers[1].key,
        },
        headers: {
          Authorization: token,
        },
      },
      (err, response) => {
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
        expect(response.json().to).toBe(initialPlayers[1].username)
        expect(response.json().from).toBe(initialPlayers[0].username)
        expect(response.json().timestamp).toBeTruthy()
        expect(response.json().ends).toBe(
          response.json().timestamp + TRADE_DURATION_MILLIS
        )
        expect(response.json().resource.amount).toBe(TRADE_POINTS)
        expect(response.json().resource.trait).toBe('vigor')
      }
    )

    await sleep(TRADE_COOLDOWN_MILLIS)

    const secondTradePoints = Math.ceil(TRADE_POINTS / TRADE_POINTS_DIVISOR)
    await serverInject(
      {
        method: 'POST',
        url: '/trades',
        payload: {
          to: initialPlayers[1].key,
        },
        headers: {
          Authorization: token,
        },
      },
      (err, response) => {
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
        expect(response.json().to).toBe(initialPlayers[1].username)
        expect(response.json().from).toBe(initialPlayers[0].username)
        expect(response.json().timestamp).toBeTruthy()
        expect(response.json().ends).toBe(
          response.json().timestamp + TRADE_DURATION_MILLIS
        )
        expect(response.json().resource.amount).toBe(secondTradePoints)
        expect(response.json().resource.trait).toBe('vigor')
      }
    )

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
        expect(
          response
            .json()
            .player.ranch.bufficorns.find((bufficorn) => bufficorn.index === 1)
            .vigor
        ).toBe(TRADE_POINTS + secondTradePoints)
      }
    )
  })

  it('should NOT TRADE resources if invalid token (check 1)', async () => {
    await serverInject(
      {
        method: 'POST',
        url: '/trades',
        payload: {
          to: initialPlayers[0].key,
          bufficorn: 'Bufficorn-0',
        },
        headers: {
          Authorization: 'invalid',
        },
      },
      (err, response) => {
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(403)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
      }
    )
  })

  // TODO: get valid token
  it('should NOT trade resources if valid token but for non existent player (check 2)', async () => {
    await serverInject(
      {
        method: 'POST',
        url: '/trades',
        payload: {
          to: 'inexistent',
          bufficorn: 'Bufficorn-0',
        },
        headers: {
          Authorization: '',
        },
      },
      (err, response) => {
        expect(err)
        expect(response.statusCode).toBe(403)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
      }
    )
  })

  test('should NOT trade resources if incubating player has not claimed its own player (check 3)', async () => {
    await serverInject(
      {
        method: 'POST',
        url: '/trades',
        payload: {
          to: initialPlayers[1].key,
          bufficorn: 'Bufficorn-0',
        },
        headers: {
          Authorization:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVmMTJlZmJkNzY1ZjlhZDMiLCJpYXQiOjE2MzI5MzI0NjN9.Koji-yz6dQyYpsGgRKiN_PEM-nvTQqXtP8Mx8icIHYQ',
        },
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

  it('should NOT trade resources if target player does not exist (check 4)', async () => {
    const token = await authenticatePlayer(initialPlayers[0].key)

    await serverInject(
      {
        method: 'POST',
        url: '/trades',
        payload: {
          to: 'foo-bar',
          bufficorn: 'Bufficorn-0',
        },
        headers: {
          Authorization: token,
        },
      },
      (err, response) => {
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(404)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
      }
    )
  })

  it('should NOT trade resources if target bufficorn does not exist', async () => {
    const token = await authenticatePlayer(initialPlayers[0].key)

    await serverInject(
      {
        method: 'POST',
        url: '/trades',
        payload: {
          to: initialPlayers[1].key,
          bufficorn: 'Bufficorn-',
        },
        headers: {
          Authorization: token,
        },
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

  it('should NOT feed bufficorn if target bufficorn does not belong to their ranch', async () => {
    const token = await authenticatePlayer(initialPlayers[0].key)

    await serverInject(
      {
        method: 'POST',
        url: '/trades',
        payload: {
          to: initialPlayers[1].key,
          bufficorn: 'Bufficorn-1',
        },
        headers: {
          Authorization: token,
        },
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

  it('should NOT trade resources if target player does not exist (check 5)', async () => {
    const token = await authenticatePlayer(initialPlayers[0].key)

    await serverInject(
      {
        method: 'POST',
        url: '/trades',
        payload: {
          to: initialPlayers[1].key,
          bufficorn: 'Bufficorn-0',
        },
        headers: {
          Authorization: token,
        },
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

  it('should NOT trade resources if FROM player is already trading with other player(check 6)', async () => {
    const token = await authenticatePlayer(initialPlayers[0].key)
    await authenticatePlayer(initialPlayers[1].key)

    await serverInject(
      {
        method: 'POST',
        url: '/trades',
        payload: {
          to: initialPlayers[1].key,
          bufficorn: 'Bufficorn-0',
        },
        headers: {
          Authorization: token,
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

    await serverInject(
      {
        method: 'POST',
        url: '/trades',
        payload: {
          to: initialPlayers[1].key,
          bufficorn: 'Bufficorn-6',
        },
        headers: {
          Authorization: token,
        },
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

  it('should NOT trade resources if target player is already trading (check 7)', async () => {
    const token1 = await authenticatePlayer(initialPlayers[0].key)
    const token2 = await authenticatePlayer(initialPlayers[1].key)

    await serverInject(
      {
        method: 'POST',
        url: '/trades',
        payload: {
          to: initialPlayers[0].key,
          bufficorn: 'Bufficorn-0',
        },
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
      }
    )

    await serverInject(
      {
        method: 'POST',
        url: '/trades',
        payload: {
          to: initialPlayers[0].key,
          bufficorn: 'Bufficorn-1',
        },
        headers: {
          Authorization: token2,
        },
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

  test('should NOT trade resources if cooldown has not elapsed (check 8)', async () => {
    const token = await authenticatePlayer(initialPlayers[0].key)
    await authenticatePlayer(initialPlayers[1].key)

    await serverInject(
      {
        method: 'POST',
        url: '/trades',
        payload: {
          to: initialPlayers[1].key,
          bufficorn: 'Bufficorn-0',
        },
        headers: {
          Authorization: token,
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

    await sleep(TRADE_DURATION_MILLIS)

    await serverInject(
      {
        method: 'POST',
        url: '/trades',
        payload: {
          to: initialPlayers[1].key,
          bufficorn: 'Bufficorn-0',
        },
        headers: {
          Authorization: token,
        },
      },
      (err, response) => {
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(409)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
      }
    )

    await sleep(TRADE_COOLDOWN_MILLIS)

    await serverInject(
      {
        method: 'POST',
        url: '/trades',
        payload: {
          to: initialPlayers[1].key,
          bufficorn: 'Bufficorn-0',
        },
        headers: {
          Authorization: token,
        },
      },
      (err, response) => {
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(200)
      }
    )
  })

  it('should sum points to player after feed', async () => {
    const bufficornName = 'Bufficorn-1'

    const token0 = await authenticatePlayer(initialPlayers[0].key)
    const token1 = await authenticatePlayer(initialPlayers[1].key)

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
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
        expect(response.json().resource.amount).toBe(TRADE_POINTS)
        expect(response.json().resource.trait).toBe('vigor')
      }
    )

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
        expect(response.json().player.points).toBe(800)
      }
    )
  })

  it('should NOT sum points to player that initiates the trade', async () => {
    const bufficornName = 'Bufficorn-1'

    const token = await authenticatePlayer(initialPlayers[0].key)
    await authenticatePlayer(initialPlayers[1].key)

    await serverInject(
      {
        method: 'POST',
        url: '/trades',
        payload: {
          to: initialPlayers[1].key,
        },
        headers: {
          Authorization: token,
        },
      },
      (err, response) => {
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
        expect(response.json().resource.amount).toBe(TRADE_POINTS)
        expect(response.json().resource.trait).toBe('vigor')
      }
    )

    await serverInject(
      {
        method: 'GET',
        url: `/players/${initialPlayers[0].key}`,
        headers: {
          Authorization: token,
        },
      },
      (err, response) => {
        expect(err).toBeFalsy()
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toBe(
          'application/json; charset=utf-8'
        )
        expect(response.json().player.points).toBe(0)
      }
    )
  })
})
