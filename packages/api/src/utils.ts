import {
  INDEX_TO_RANCH,
  PLAYER_MINT_TIMESTAMP,
  GAME_END_TIMESTAMP,
  PLAYER_MAINNET_TIMESTAMP,
  RANCHES_COUNT,
  TRADE_COOLDOWN_MILLIS,
  TRADE_DURATION_MILLIS,
} from './constants'
import {
  BonusRanchName,
  BufficornLeaderboardInfo,
  FarmerAward,
  PlayerLeaderboardInfo,
  RanchLeaderboardInfo,
  RanchName,
  Trait,
} from './types'
import { uniqueNamesGenerator, adjectives, names } from 'unique-names-generator'
import { Bufficorn } from './domain/bufficorn'
import { PlayerModel } from './models/player'
import { BufficornModel } from './models/bufficorn'
import { RanchModel } from './models/ranch'
import { Player } from './domain/player'
import { Ranch } from './domain/ranch'

export function calculateRemainingCooldown(
  tradeEnds: number,
  currentTimestamp = Date.now(),
  tradeDuration: number = TRADE_DURATION_MILLIS,
  tradeCooldown: number = TRADE_COOLDOWN_MILLIS
) {
  const remainingMillis =
    tradeEnds - tradeDuration + tradeCooldown - currentTimestamp

  return remainingMillis > 0 ? remainingMillis : 0
}

export function calculateRemainingDuration(
  tradeEnds: number,
  currentTimestamp = Date.now()
) {
  const remainingMillis = tradeEnds - currentTimestamp

  return remainingMillis > 0 ? remainingMillis : 0
}

export function getRanchFromIndex(index: number): RanchName {
  const ranchIndex = index % RANCHES_COUNT

  return INDEX_TO_RANCH[ranchIndex]
}

export function fromHexToUint8Array(hex: string) {
  return Uint8Array.from(Buffer.from(hex.substring(2).padStart(64, '0'), 'hex'))
}

export function gameOver() {
  return Date.now() >= GAME_END_TIMESTAMP * 1000
}

export function isTimeToMint() {
  return Date.now() >= PLAYER_MINT_TIMESTAMP * 1000
}

export function isMainnetTime() {
  return Date.now() >= PLAYER_MAINNET_TIMESTAMP * 1000
}

export function printRemainingMillis(millis: number) {
  const seconds = Math.ceil(millis / 1000)
  if (seconds < 60) {
    return `${seconds} sec`
  } else {
    return `${Math.ceil(seconds / 60)} min`
  }
}

export function groupBufficornsByRanch(
  bufficorns: Array<Bufficorn>
): Record<RanchName, Array<Bufficorn>> {
  const bufficornsByRanch = {} as Record<RanchName, Array<Bufficorn>>

  for (let bufficorn of bufficorns) {
    if (bufficornsByRanch[bufficorn.ranch]) {
      bufficornsByRanch[bufficorn.ranch].push(bufficorn)
    } else {
      bufficornsByRanch[bufficorn.ranch] = [bufficorn]
    }
  }
  return bufficornsByRanch
}

export function generateUsernameList(count: number): Array<string> {
  const usernames = new Set<string>()
  // The seed must start at 1 because 0 means "use Math.random"
  let counter = 1

  while (usernames.size < count) {
    let username = uniqueNamesGenerator({
      dictionaries: [adjectives, names],
      seed: counter,
      separator: '-',
      style: 'lowerCase',
    })
    usernames.add(username)
    counter += 1
  }

  // Convert set into array to allow indexing by index
  return Array.from(usernames)
}

export function getFarmerAward(
  playerName: string,
  topPlayers: Array<PlayerLeaderboardInfo>
): FarmerAward | null {
  let farmerAward: FarmerAward | null = null
  for (let topPlayer of topPlayers) {
    if (playerName === topPlayer.username) {
      farmerAward = {
        category: 0,
        ranking: topPlayer.position + 1,
        bufficornId: 0,
      }
      break
    }
  }

  return farmerAward
}

export function getRanchAward(
  playerRanch: RanchName | BonusRanchName,
  topRanches: Array<RanchLeaderboardInfo>
): FarmerAward | null {
  let ranchAward: FarmerAward | null = null
  for (let topRanch of topRanches) {
    if (playerRanch === topRanch.name) {
      ranchAward = {
        category: 1,
        ranking: topRanch.position + 1,
        bufficornId: 0,
      }
      break
    }
  }
  return ranchAward
}

export function getBestBufficornAwards(
  playerRanch: RanchName | BonusRanchName,
  topBufficorns: Array<BufficornLeaderboardInfo>,
  categoryIndex: number
): FarmerAward | null {
  let bufficornAward = null
  for (let topBufficorn of topBufficorns) {
    if (playerRanch === topBufficorn.ranch) {
      bufficornAward = {
        category: 2 + categoryIndex,
        ranking: topBufficorn.position + 1,
        bufficornId: topBufficorn.creationIndex,
      }
    }
  }
  return bufficornAward
}

export async function calculateAllPlayerAwards(
  player: Player,
  fastifyInstance: {
    playerModel: PlayerModel
    bufficornModel: BufficornModel
    ranchModel: RanchModel
  }
): Promise<Array<FarmerAward>> {
  const farmerAwards = []
  const { playerModel, bufficornModel, ranchModel } = fastifyInstance
  const players: Array<Player> = await playerModel.getAllRegistered()
  const bufficorns: Array<Bufficorn> = await bufficornModel.getAll()
  const bufficornsByRanch = groupBufficornsByRanch(bufficorns)
  const ranches: Array<Ranch> = (await ranchModel.getAll()).map((r) => {
    r.addBufficorns(bufficornsByRanch[r.name])
    return r
  })

  const sortedPlayers = Player.getLeaderboard(players, players.length).players

  const farmerAward = getFarmerAward(player.username, sortedPlayers)

  if (farmerAward) {
    farmerAwards.push(farmerAward)
  } else {
    console.error('All farmers should have a farmer award')
  }

  const leaderboardRanches = Ranch.getLeaderboard(ranches)
  const ranchAward = getRanchAward(player.ranch, leaderboardRanches)
  if (ranchAward) {
    farmerAwards.push(ranchAward)
  } else {
    console.error('All farmers should have a ranch award')
  }

  const bufficornTraits = [
    // undefined will get the leaderboard sorted according to how balanced are the bufficorns
    undefined,
    Trait.Coat,
    Trait.Coolness,
    Trait.Intelligence,
    Trait.Speed,
    Trait.Stamina,
    Trait.Vigor,
  ]

  // Iterate over all the traits and get corresponding medal
  for (const [categoryIndex, category] of bufficornTraits.entries()) {
    const top3Bufficorns = Bufficorn.top3(bufficorns, category)
    const bufficornCategoryAward = getBestBufficornAwards(
      player.ranch,
      top3Bufficorns,
      categoryIndex
    )
    if (bufficornCategoryAward) {
      farmerAwards.push(bufficornCategoryAward)
    }
  }

  return farmerAwards
}
