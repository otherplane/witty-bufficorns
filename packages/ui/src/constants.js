export const CONTRACT_ADDRESS =
  import.meta.env.VITE_CONTRACT_ADDRESS ||
  '0xDc7135D817Ab955ddF90D33f144c150a622e133E'

export const OPENSEA_BASE_URL =
  import.meta.env.VITE_OPENSEA_BASE_URL ||
  'https://opensea.io/assets/0x855BCa56D00F3f550D0c610BBF562FEBF6540bc6'

export const EXPLORER_BASE_URL =
  import.meta.env.VITE_EXPLORER_BASE_URL || 'https://polygonscan.com/tx/'

export const NETWORK = import.meta.env.VITE_NETWORK || 80001

export const VITE_TEST = import.meta.env.VITE_TEST || false

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://0.0.0.0:4000'

export const BASE_URL =
  import.meta.env.VITE_BASE_URL || 'https://bufficorns.com'

export const POLLER_MILLISECONDS =
  import.meta.env.VITE_POLLER_MILLISECONDS || 5000

export const TIME_TO_MINT_MILLISECONDS =
  import.meta.env.VITE_TIME_TO_MINT_MILLISECONDS || 60000

export const DEMO_ENDS_TIMESTAMP =
  import.meta.env.VITE_DEMO_ENDS_TIMESTAMP || 1645131600000

export const GAME_ENDS_TIMESTAMP =
  import.meta.env.VITE_GAME_ENDS_TIMESTAMP || 1645351200000

export const PLAYER_MAINNET_TIMESTAMP = process.env.PLAYER_MAINNET_TIMESTAMP
  ? parseInt(process.env.VITE_PLAYER_MAINNET_TIMESTAMP)
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

const BUFFICORN_NAME = {
  // ranch1
  'Bufficorn-0' : 'Bufficorn-0',
  'Bufficorn-6' : 'Bufficorn-6',
  'Bufficorn12' : 'Bufficorn-12',
  'Bufficorn18' : 'Bufficorn-18',
  // ranch2
  'Bufficorn-1' : 'Bufficorn-1',
  'Bufficorn-7' : 'Bufficorn-7',
  'Bufficorn13' : 'Bufficorn-13',
  'Bufficorn19' : 'Bufficorn-19',
  // balancer
  'Bufficorn-2' : 'Bufficorn BALler',
  'Bufficorn-8' : 'AMMcorn',
  'Bufficorn14' : 'Ferntalik',
  'Bufficorn20' : 'BALlicorn',

  // algorand 
  'Bufficorn-3' : 'ZKcorn',
  'Bufficorn-9' : 'Micalicorn',
  'Bufficorn15' : 'Mr.Grantsalot',
  'Bufficorn21' : 'Buffirand',
  // ranch5
  'Bufficorn-4' : 'Bufficorn-4',
  'Bufficorn10' : 'Bufficorn-10',
  'Bufficorn16' : 'Bufficorn-16',
  'Bufficorn22' : 'Bufficorn-22',
  // ranch6
  'Bufficorn-5' : 'Bufficorn-5',
  'Bufficorn11' : 'Bufficorn-11',
  'Bufficorn17' : 'Bufficorn-17',
  'Bufficorn23' : 'Bufficorn-23',
}