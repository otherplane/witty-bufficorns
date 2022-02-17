/**
 * Constants. These can be customized through environment variables.
 */

import { BufficornName, RanchIndex, RanchName, Trait } from './types'

// Byte length of players keys. This can be adjusted for usability vs. security trade-offs.
let playerKeyLengthBytes: number = process.env.PLAYER_KEY_LENGTH_BYTES
  ? parseInt(process.env.PLAYER_KEY_LENGTH_BYTES)
  : 8
// Ensure that player keys byte length is 8 <= x < 30
if (playerKeyLengthBytes < 8 || playerKeyLengthBytes > 30) {
  playerKeyLengthBytes = 8
}
export const PLAYER_KEY_LENGTH_BYTES = playerKeyLengthBytes

// Base string to use for salting the deterministic player key derivation.
export const PLAYER_KEY_SALT: string = process.env.PLAYER_KEY_SALT || ''

// JWT secret to derive tokens
export const JWT_SECRET: string = process.env.JWT_SECRET || 'secret'

// Player trade duration in millis
export const TRADE_DURATION_MILLIS = process.env.TRADE_DURATION_MILLIS
  ? parseInt(process.env.TRADE_DURATION_MILLIS)
  : 2 * 60 * 1000

// Player trade cooldown in millis
export const TRADE_COOLDOWN_MILLIS = process.env.TRADE_COOLDOWN_MILLIS
  ? Math.max(parseInt(process.env.TRADE_COOLDOWN_MILLIS), TRADE_DURATION_MILLIS)
  : Math.max(2 * 60 * 60 * 1000, TRADE_DURATION_MILLIS)

// Trade base points
export const TRADE_POINTS = process.env.TRADE_POINTS
  ? parseInt(process.env.TRADE_POINTS)
  : 800

// Minimum amount of points that can be rewarded after a trade
export const TRADE_POINTS_MIN = process.env.TRADE_POINTS_MIN
  ? parseInt(process.env.TRADE_POINTS_MIN)
  : 50

// Trade point divisor to be applied every time the same trade happens
export const TRADE_POINTS_DIVISOR = process.env.TRADE_POINTS_DIVISOR
  ? parseInt(process.env.TRADE_POINTS_DIVISOR)
  : 2

// Points are divided by this factor when in testnet
export const TESTNET_POINTS_DIVISOR = process.env.TESTNET_POINTS_DIVISOR
  ? parseInt(process.env.TESTNET_POINTS_DIVISOR)
  : 10

// Secp256k1 private key used for signing in the `mint` endpoint
export const MINT_PRIVATE_KEY = process.env.MINT_PRIVATE_KEY || '0x00'
// '0xb5b1870957d373ef0eeffecc6e4812c0fd08f554b37b233526acc331bf1544f7'

// Tell how many players to generate
export const PLAYERS_COUNT: number = process.env.PLAYERS_COUNT
  ? parseInt(process.env.PLAYERS_COUNT)
  : 9049

// Tell how many bufficorns to generate for each ranch
export const BUFFICORNS_PER_RANCH: number = process.env.BUFFICORNS_PER_RANCH
  ? parseInt(process.env.BUFFICORNS_PER_RANCH)
  : 4

// Number of different ranches
export const RANCHES_COUNT = process.env.RANCHES_COUNT
  ? parseInt(process.env.RANCHES_COUNT)
  : 6

// Awards date in millis
// If `PLAYER_MINT_TIMESTAMP=0`, checks are ignored (for testing purposes)
export const PLAYER_MINT_TIMESTAMP = process.env.PLAYER_MINT_TIMESTAMP
  ? parseInt(process.env.PLAYER_MINT_TIMESTAMP)
  : 1645353000 // Sunday, February 20, 2022 18:30:00 PM (UTC)

// If `GAME_END_TIMESTAMP=0`, checks are ignored (for testing purposes)
export const GAME_END_TIMESTAMP = process.env.GAME_END_TIMESTAMP
  ? parseInt(process.env.GAME_END_TIMESTAMP)
  : 1645351200 // Sunday, February 20, 2022 18:00:00 PM (UTC)

// Mainnet date in millis
// If `PLAYER_MAINNET_TIMESTAMP=0`, checks are ignored (for testing purposes)
export const PLAYER_MAINNET_TIMESTAMP = process.env.PLAYER_MAINNET_TIMESTAMP
  ? parseInt(process.env.PLAYER_MAINNET_TIMESTAMP)
  : 1645131600 // Thursday, February 17, 2022 09:00:00 PM (UTC)

// Web3 provider URL
export const WEB3_PROVIDER =
  process.env.WEB3_PROVIDER || 'https://rpc-mainnet.maticvigil.com'

// WitmonERC721 contract address
export const WITTY_BUFFICORNS_ERC721_ADDRESS =
  process.env.WITTY_BUFFICORNS_ERC721_ADDRESS ||
  '0x82321F45D684900E4fd7fE3bB31f7eA88B8b9E98'

export const MONGO_URI: string =
  process.env.MONGO_URI ||
  'MONGO_URI=mongodb://your_username:your_password@localhost:27017/database'

export const PLUGIN_TIMEOUT: number = parseInt(
  process.env.PLUGIN_TIMEOUT || '120000'
)

// Default bonus time: 30 minutes
export const POAP_BONUS_TIME: number = parseInt(
  process.env.POAP_BONUS_TIME || '1800000'
)

// When a bonus is active, the player will have their points multiplied by this factor
export const BONUS_MULTIPLIER: number = parseFloat(
  process.env.BONUS_MULTIPLIER || '2'
)

export const TOTAL_BUFFICORNS = 24

export const POAP_LIST_PATH = process.env.POAP_LIST_PATH || '/test_poaps.json'

export const BUFFICORN_INDEX: Record<number, BufficornName> = {
  0: BufficornName.Bufficorn0,
  1: BufficornName.Bufficorn1,
  2: BufficornName.Bufficorn2,
  3: BufficornName.Bufficorn3,
  4: BufficornName.Bufficorn4,
  5: BufficornName.Bufficorn5,
  6: BufficornName.Bufficorn6,
  7: BufficornName.Bufficorn7,
  8: BufficornName.Bufficorn8,
  9: BufficornName.Bufficorn9,
  10: BufficornName.Bufficorn10,
  11: BufficornName.Bufficorn11,
  12: BufficornName.Bufficorn12,
  13: BufficornName.Bufficorn13,
  14: BufficornName.Bufficorn14,
  15: BufficornName.Bufficorn15,
  16: BufficornName.Bufficorn16,
  17: BufficornName.Bufficorn17,
  18: BufficornName.Bufficorn18,
  19: BufficornName.Bufficorn19,
  20: BufficornName.Bufficorn20,
  21: BufficornName.Bufficorn21,
  22: BufficornName.Bufficorn22,
  23: BufficornName.Bufficorn23,
}

export const BUFFICORNS_INDEX_GROUP_BY_RANCH: Record<
  RanchName,
  Array<number>
> = {
  [RanchName.Ranch1]: [0, 6, 12, 18],
  [RanchName.Ranch2]: [1, 7, 13, 19],
  [RanchName.Ranch3]: [2, 8, 14, 20],
  [RanchName.Ranch4]: [3, 9, 15, 21],
  [RanchName.Ranch5]: [4, 10, 16, 22],
  [RanchName.Ranch6]: [5, 11, 17, 23],
}

export const INDEX_TO_RANCH: Record<number, RanchName> = {
  [RanchIndex.Ranch1]: RanchName.Ranch1,
  [RanchIndex.Ranch2]: RanchName.Ranch2,
  [RanchIndex.Ranch3]: RanchName.Ranch3,
  [RanchIndex.Ranch4]: RanchName.Ranch4,
  [RanchIndex.Ranch5]: RanchName.Ranch5,
  [RanchIndex.Ranch6]: RanchName.Ranch6,
}

export const RANCH_TO_INDEX: Record<RanchName, number> = {
  [RanchName.Ranch1]: RanchIndex.Ranch1,
  [RanchName.Ranch2]: RanchIndex.Ranch2,
  [RanchName.Ranch3]: RanchIndex.Ranch3,
  [RanchName.Ranch4]: RanchIndex.Ranch4,
  [RanchName.Ranch5]: RanchIndex.Ranch5,
  [RanchName.Ranch6]: RanchIndex.Ranch6,
}

export const TRAIT_BY_RANCH: Record<RanchName, Trait> = {
  [RanchName.Ranch1]: Trait.Coat,
  [RanchName.Ranch2]: Trait.Coolness,
  [RanchName.Ranch3]: Trait.Intelligence,
  [RanchName.Ranch4]: Trait.Speed,
  [RanchName.Ranch5]: Trait.Stamina,
  [RanchName.Ranch6]: Trait.Vigor,
}

export const categoryToPrize: Record<number, Trait> = {
  3 : Trait.Coat,
  4 : Trait.Coolness,
  5 : Trait.Intelligence,      
  6 : Trait.Speed,
  7 : Trait.Stamina,
  8 : Trait.Vigor 
}

export default {
  RANCHES_COUNT,
  PLAYER_KEY_LENGTH_BYTES,
  PLAYER_MINT_TIMESTAMP,
  GAME_END_TIMESTAMP,
  PLAYERS_COUNT,
  TRADE_COOLDOWN_MILLIS,
  TRADE_DURATION_MILLIS,
  TRADE_POINTS,
  TRADE_POINTS_DIVISOR,
  TRADE_POINTS_MIN,
  MONGO_URI,
  WITTY_BUFFICORNS_ERC721_ADDRESS,
  TRAIT_BY_RANCH,
  INDEX_TO_RANCH,
  BUFFICORNS_INDEX_GROUP_BY_RANCH,
  PLUGIN_TIMEOUT,
  TOTAL_BUFFICORNS,
  POAP_BONUS_TIME,
  BONUS_MULTIPLIER,
  TESTNET_POINTS_DIVISOR,
}
