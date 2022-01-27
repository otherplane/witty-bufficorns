export const CONTRACT_ADDRESS =
  import.meta.env.CONTRACT_ADDRESS ||
  '0x855BCa56D00F3f550D0c610BBF562FEBF6540bc6'

export const OPENSEA_BASE_URL =
  import.meta.env.OPENSEA_BASE_URL ||
  'https://opensea.io/assets/0x855BCa56D00F3f550D0c610BBF562FEBF6540bc6'

export const ETHERSCAN_BASE_URL =
  import.meta.env.ETHERSCAN_BASE_URL || 'https://etherscan.io/tx'

export const NETWORK = import.meta.env.NETWORK || 'main'

export const VITE_TEST = import.meta.env.VITE_TEST || false

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://0.0.0.0:4000'

export const BASE_URL =
  import.meta.env.VITE_BASE_URL || 'https://wittycreatures.com'

export const RANCHES = {
  ['Opolis Reservation']: 'opolis',
  [`The Ol' Algoranch`]: 'algorand',
  [`Vega Slopes Range`]: 'vega',
  [`Balancer Peak State`]: 'balancer',
  [`Gold Reef Co.`]: 'reef',
  [`Infinite Harmony Farm`]: 'harmony'
}

export const STATS_FILTERS = {
  players: {
    key: 'players',
    active: false,
    default: 'overall',
    subTabs: {
      overall: {
        key: 'overall',
        active: false
      }
    }
  },
  bufficorns: {
    key: 'bufficorns',
    active: false,
    default: 'vigor',
    subTabs: {
      overall: {
        key: 'overall',
        active: false
      },
      vigor: {
        key: 'vigor',
        active: false
      },
      speed: {
        key: 'speed',
        active: false
      },
      agility: {
        key: 'agility',
        active: false
      },
      coolness: {
        key: 'coolness',
        active: false
      },
      coat: {
        key: 'coat',
        active: false
      },
      stamina: {
        key: 'stamina',
        active: false
      }
    }
  },
  ranches: {
    key: 'ranches',
    active: false,
    default: 'overall',
    subTabs: {
      overall: {
        key: 'overall',
        active: false
      }
    }
  }
}
