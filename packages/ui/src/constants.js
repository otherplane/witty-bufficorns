export const CONTRACT_ADDRESS =
  import.meta.env.CONTRACT_ADDRESS ||
  '0xf9ce07c40885FD47905d5972377801a5db5652B3'

export const OPENSEA_BASE_URL =
  import.meta.env.OPENSEA_BASE_URL ||
  'https://opensea.io/assets/0x855BCa56D00F3f550D0c610BBF562FEBF6540bc6'

export const ETHERSCAN_BASE_URL =
  import.meta.env.ETHERSCAN_BASE_URL || 'https://etherscan.io/tx'

export const NETWORK = import.meta.env.NETWORK || 80001

export const VITE_TEST = import.meta.env.VITE_TEST || false

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://0.0.0.0:4000'

export const BASE_URL =
  import.meta.env.VITE_BASE_URL || 'https://bufficorns.com'

export const POLLER_MILLISECONDS =
  import.meta.env.VITE_POLLER_MILLISECONDS || 5000

export const PLAYER_MAINNET_TIMESTAMP = process.env.PLAYER_MAINNET_TIMESTAMP
  ? parseInt(process.env.PLAYER_MAINNET_TIMESTAMP)
  : 1645131600 // Thursday, February 17, 2022 09:00:00 PM (UTC)

export const RANCHES = {
  ['Opolis Reservation']: 'opolis',
  [`The Ol' Algoranch`]: 'algorand',
  [`Vega Slopes Range`]: 'vega',
  [`Balancer Peak State`]: 'balancer',
  [`Gold Reef Co.`]: 'reef',
  [`Infinite Harmony Farm`]: 'harmony',
  ['WITNET_RANCH']: 'witnet'
}
export const ATTRIBUTES = {
  coat: {
    key: 'coat',
    label: 'coat',
    color: '#cc1919',
    resource: 'Warm Hay'
  },
  coolness: {
    key: 'coolness',
    label: 'coolness',
    color: '#217821',
    resource: 'Fresh Grass'
  },
  intelligence: {
    key: 'intelligence',
    label: 'intellect',
    color: '#1a1a1a',
    resource: 'Smart Sedge'
  },
  speed: {
    key: 'speed',
    label: 'speed',
    color: '#ffad00',
    resource: 'Mighty Acorn'
  },
  stamina: {
    key: 'stamina',
    label: 'stamina',
    color: '#124ca1',
    resource: 'Tireless Water'
  },
  vigor: {
    key: 'vigor',
    label: 'vigor',
    color: '#512791',
    resource: 'Hearty Berry'
  }
}
export const STATS_FILTERS = {
  players: {
    key: 'players',
    active: false,
    default: 'overall',
    showSubtabs: false,
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
    default: 'overall',
    showSubtabs: true,
    subTabs: {
      overall: {
        key: 'overall',
        active: false
      },
      coat: {
        key: 'coat',
        active: false
      },
      coolness: {
        key: 'coolness',
        active: false
      },
      intelligence: {
        key: 'intelligence',
        active: false
      },
      speed: {
        key: 'speed',
        active: false
      },
      stamina: {
        key: 'stamina',
        active: false
      },
      vigor: {
        key: 'vigor',
        active: false
      }
    }
  },
  ranches: {
    key: 'ranches',
    active: false,
    default: 'overall',
    showSubtabs: false,
    subTabs: {
      overall: {
        key: 'overall',
        active: false
      }
    }
  }
}
