/**
 * Constants. These can be customized through environment variables.
 */

import { Ranch, Trait } from './types'

export const RANCHES = [
  {
    name: Ranch[0],
    resource: Trait[0],
    medals: [],
  },
  {
    name: Ranch[1],
    resource: Trait[1],
    medals: [],
  },
  {
    name: Ranch[2],
    resource: Trait[2],
    medals: [],
  },
  {
    name: Ranch[3],
    resource: Trait[3],
    medals: [],
  },
  {
    name: Ranch[4],
    resource: Trait[4],
    medals: [],
  },
  {
    name: Ranch[5],
    resource: Trait[5],
    medals: [],
  },
]

// Byte length of egg keys. This can be adjusted for usability vs. security trade-offs.
let playerKeyLengthBytes: number = process.env.PLAYER_KEY_LENGTH_BYTES
  ? parseInt(process.env.PLAYER_KEY_LENGTH_BYTES)
  : 8
// Ensure that egg keys byte length is 8 <= x < 30
if (playerKeyLengthBytes < 8 || playerKeyLengthBytes > 30) {
  playerKeyLengthBytes = 8
}
export const PLAYER_KEY_LENGTH_BYTES = playerKeyLengthBytes

// Base string to use for salting the deterministic egg key derivation.
export const PLAYER_KEY_SALT: string = process.env.EGG_KEY_SALT || ''

// JWT secret to derive tokens
export const JWT_SECRET: string = process.env.JWT_SECRET || 'secret'

// Egg incubation duration in millis
export const INCUBATION_DURATION_MILLIS = process.env.INCUBATION_DURATION_MILLIS
  ? parseInt(process.env.INCUBATION_DURATION_MILLIS)
  : 2 * 60 * 1000

// Egg incubation cooldown in millis
export const INCUBATION_COOLDOWN_MILLIS = process.env.INCUBATION_COOLDOWN_MILLIS
  ? Math.max(
      parseInt(process.env.INCUBATION_COOLDOWN_MILLIS),
      INCUBATION_DURATION_MILLIS
    )
  : Math.max(2 * 60 * 60 * 1000, INCUBATION_DURATION_MILLIS)

// Incubation points
export const INCUBATION_POINTS = process.env.INCUBATION_POINTS
  ? parseInt(process.env.INCUBATION_POINTS)
  : 800

// Minimum amount of points that can be rewarded after an incubation
export const INCUBATION_POINTS_MIN = process.env.INCUBATION_POINTS_MIN
  ? parseInt(process.env.INCUBATION_POINTS_MIN)
  : 50

// Incubation point divisor to be applied every time the same incubation happens
export const INCUBATION_POINTS_DIVISOR = process.env.INCUBATION_POINTS_DIVISOR
  ? parseInt(process.env.INCUBATION_POINTS_DIVISOR)
  : 2

// Secp256k1 private key used for signing in the `mint` endpoint
export const MINT_PRIVATE_KEY = process.env.MINT_PRIVATE_KEY || '0x00'
// '0xb5b1870957d373ef0eeffecc6e4812c0fd08f554b37b233526acc331bf1544f7'

// Tell how many eggs to generate
export const PLAYERS_COUNT: number = process.env.PLAYERS_COUNT
  ? parseInt(process.env.PLAYERS_COUNT)
  : 10

// Tell how many bufficorns to generate for each ranch
export const BUFFICORNS_PER_RANCH: number = process.env.BUFFICORNS_PER_RANCH
  ? parseInt(process.env.BUFFICORNS_PER_RANCH)
  : 4

// Number of different ranches
export const RANCH_COUNT = process.env.RANCH_COUNT
  ? parseInt(process.env.RANCH_COUNT)
  : 6

// Egg birth/hatch date in millis
// If `EGG_MINT_TIMESTAMP=0`, checks are ignored (for testing purposes)
export const PLAYER_MINT_TIMESTAMP = process.env.PLAYER_MINT_TIMESTAMP
  ? parseInt(process.env.PLAYER_MINT_TIMESTAMP)
  : 1645351200 // Sunday, February 20, 2022 18:00:00 PM (UTC)

// Web3 provider URL
export const WEB3_PROVIDER =
  process.env.WEB3_PROVIDER || 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID'

// WitmonERC721 contract address
export const WITMON_ERC721_ADDRESS =
  process.env.WITMON_ERC721_ADDRESS ||
  '0x691908f883E006C0fB42da190A9EA07E6996D6c6'

export const MONGO_URI: string =
  process.env.MONGO_URI ||
  'MONGO_URI=mongodb://your_username:your_password@localhost:27017/database'

export default {
  RANCH_COUNT,
  PLAYER_KEY_LENGTH_BYTES,
  PLAYER_MINT_TIMESTAMP,
  PLAYERS_COUNT,
  INCUBATION_COOLDOWN_MILLIS,
  INCUBATION_DURATION_MILLIS,
  INCUBATION_POINTS,
  INCUBATION_POINTS_DIVISOR,
  INCUBATION_POINTS_MIN,
  MONGO_URI,
  WITMON_ERC721_ADDRESS,
}
