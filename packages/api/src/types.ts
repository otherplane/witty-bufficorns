import { Static, Type, TSchema } from '@sinclair/typebox'
export { Db, Collection, ObjectId, WithId } from 'mongodb'

const Nullable = <T extends TSchema>(type: T) => Type.Union([type, Type.Null()])

export const ClaimPlayerParams = Type.Object({
  key: Type.String(),
})
export type ClaimPlayerParams = Static<typeof ClaimPlayerParams>

export enum RanchName {
  Ranch1 = 'Gold Reef Co.',
  Ranch2 = 'Infinite Harmony Farm',
  Ranch3 = 'Balancer Peak State',
  Ranch4 = "The Ol' Algoranch",
  Ranch5 = 'Vega Slopes Range',
  Ranch6 = 'Opolis Reservation',
}

export const RanchNameEnum = Type.Enum(RanchName)

export const BonusRanchName = Type.Literal('WITNET_RANCH')
export type BonusRanchName = Static<typeof BonusRanchName>

export enum Trait {
  Coat = 'coat',
  Coolness = 'coolness',
  Intelligence = 'intelligence',
  Speed = 'speed',
  Stamina = 'stamina',
  Vigor = 'vigor',
}
export const TraitEnum = Type.Enum(Trait)

export enum RanchIndex {
  Ranch1 = 0,
  Ranch2 = 1,
  Ranch3 = 2,
  Ranch4 = 3,
  Ranch5 = 4,
  Ranch6 = 5,
}

export const Resource = Type.Object({
  trait: TraitEnum,
  amount: Type.Number(),
})
export type Resource = Static<typeof Resource>

export const BufficornVTO = Type.Object({
  name: Type.String(),
  ranch: RanchNameEnum,
  [Trait.Coat]: Type.Integer(),
  [Trait.Coolness]: Type.Integer(),
  [Trait.Intelligence]: Type.Integer(),
  [Trait.Speed]: Type.Integer(),
  [Trait.Stamina]: Type.Integer(),
  [Trait.Vigor]: Type.Integer(),
  medals: Type.Array(Type.Optional(Type.String())),
  creationIndex: Type.Integer(),
})

export type BufficornVTO = Static<typeof BufficornVTO>

export const RanchVTO = Type.Object({
  name: RanchNameEnum,
  bufficorns: Type.Array(BufficornVTO),
  medals: Type.Array(Type.Optional(Type.String())),
  trait: TraitEnum,
  creationIndex: Type.Integer(),
})
export type RanchVTO = Static<typeof RanchVTO>

export const BonusRanchVTO = Type.Object({
  name: BonusRanchName,
  bufficorns: Type.Tuple([]),
  medals: Type.Tuple([]),
  trait: Type.Null(),
  creationIndex: Type.Null(),
})
export type BonusRanchVTO = Static<typeof BonusRanchVTO>

export const DbRanchVTO = Type.Object({
  name: RanchNameEnum,
  trait: TraitEnum,
  bufficorns: Type.Array(Type.String()),
  medals: Type.Array(Type.Optional(Type.String())),
  creationIndex: Type.Integer(),
})

export type DbRanchVTO = Static<typeof DbRanchVTO>

export const AuthorizationHeader = Type.Object({
  Authorization: Type.String(),
})
export type AuthorizationHeader = Static<typeof AuthorizationHeader>

export const GetByStringKeyParams = Type.Object({
  key: Type.String(),
})
export type GetByStringKeyParams = Static<typeof GetByStringKeyParams>

export const BufficornLeaderboardInfo = Type.Object({
  name: Type.String(),
  ranch: Type.String(),
  [Trait.Coat]: Type.Integer(),
  [Trait.Coolness]: Type.Integer(),
  [Trait.Intelligence]: Type.Integer(),
  [Trait.Speed]: Type.Integer(),
  [Trait.Stamina]: Type.Integer(),
  [Trait.Vigor]: Type.Integer(),
  score: Type.Integer(),
  position: Type.Integer(),
  creationIndex: Type.Integer(),
})
export type BufficornLeaderboardInfo = Static<typeof BufficornLeaderboardInfo>

export const RanchLeaderboardInfo = Type.Object({
  name: Type.String(),
  score: Type.Integer(),
  position: Type.Integer(),
  creationIndex: Type.Integer(),
})
export type RanchLeaderboardInfo = Static<typeof RanchLeaderboardInfo>

export const PlayerLeaderboardInfo = Type.Object({
  username: Type.String(),
  points: Type.Integer(),
  position: Type.Integer(),
  creationIndex: Type.Integer(),
})
export type PlayerLeaderboardInfo = Static<typeof PlayerLeaderboardInfo>

export const LeaderboardParams = Type.Object({
  resource: Type.Optional(TraitEnum),
  limit: Type.Optional(Type.Integer()),
  offset: Type.Optional(Type.Integer()),
  filter: Type.Optional(Type.String()),
})
export type LeaderboardParams = Static<typeof LeaderboardParams>

export const LeaderboardResponse = Type.Object({
  bufficorns: Type.Array(BufficornLeaderboardInfo),
  ranches: Type.Array(RanchLeaderboardInfo),
  players: Type.Object({
    players: Type.Array(PlayerLeaderboardInfo),
    total: Type.Integer(),
  }),
})
export type LeaderboardResponse = Static<typeof LeaderboardResponse>

export const JwtVerifyPayload = Type.Object({
  id: Type.String(),
  iat: Type.Number(),
})
export type JwtVerifyPayload = Static<typeof JwtVerifyPayload>

export const FarmerAward = Type.Object({
  category: Type.Number(),
  ranking: Type.Number(),
  bufficornId: Type.Number(),
})
export type FarmerAward = Static<typeof FarmerAward>

export const PreviewParams = Type.Object({
  token_ids: Type.Array(Type.String()),
})
export type PreviewParams = Static<typeof PreviewParams>

export const PreviewReply = Type.Array(FarmerAward)

export type PreviewReply = Static<typeof PreviewReply>

export const PreviewImageNameReply = Type.Array(Type.String())
export type PreviewImageNameReply = Static<typeof PreviewImageNameReply>

export const MintParams = Type.Object({
  address: Type.String(),
})
export type MintParams = Static<typeof MintParams>

export const MintOutput = Type.Object({
  envelopedSignature: Type.Object({
    message: Type.String(),
    messageHash: Type.Optional(Type.String()),
    signature: Type.String(),
  }),
  data: Type.Object({
    address: Type.String(),
    ranchId: Type.Number(),
    farmerId: Type.Number(),
    farmerScore: Type.Number(),
    farmerName: Type.String(),
    farmerAwards: Type.Array(FarmerAward),
  }),
})
export type MintOutput = Static<typeof MintOutput>

export const GetByNumericKeyParams = Type.Object({
  key: Type.Number(),
})
export type GetByNumericKeyParams = Static<typeof GetByNumericKeyParams>

export const TradeParams = Type.Object({
  to: Type.String(),
  cooldown: Type.Optional(Type.Number()),
})
export type TradeParams = Static<typeof TradeParams>

export const TradeResult = Type.Object({
  resource: Resource,
  ends: Type.Number(),
  from: Type.String(),
  to: Type.String(),
  timestamp: Type.Number(),
  bufficorn: Type.String(),
})
export type TradeResult = Static<typeof TradeParams>

export const DbTradeVTO = Type.Object({
  bufficorn: Type.String(),
  from: Type.String(),
  to: Type.String(),
  resource: Type.Object({
    trait: TraitEnum,
    amount: Type.Number(),
  }),
  timestamp: Type.Number(),
  ends: Type.Number(),
  mainnetFlag: Type.Boolean(),
  bonusFlag: Type.Boolean(),
})
export type DbTradeVTO = Static<typeof DbTradeVTO>

export const TradeHistoryParams = Type.Object({
  limit: Type.Optional(Type.Integer()),
  offset: Type.Optional(Type.Integer()),
})
export type TradeHistoryParams = Static<typeof TradeHistoryParams>

export const TradeHistoryResponse = Type.Object({
  trades: Type.Object({
    trades: Type.Array(DbTradeVTO),
    total: Type.Integer(),
  }),
})

export type TradeHistoryResponse = Static<typeof TradeHistoryResponse>
export const PlayerVTO = Type.Object({
  key: Type.String(),
  token: Type.Optional(Type.String()),
  username: Type.String(),
  ranch: Type.Union([RanchVTO, BonusRanchVTO]),
  points: Type.Integer(),
  testnetPoints: Type.Integer(),
  medals: Type.Array(Type.Optional(Type.String())),
  selectedBufficorn: Type.Integer(),
  creationIndex: Type.Integer(),
  bonusEndsAt: Type.Integer(),
  scannedBonuses: Type.Array(Type.String()),
})
export type PlayerVTO = Static<typeof PlayerVTO>

export const ProtectedPlayerVTO = Type.Omit(PlayerVTO, ['token'])
export type ProtectedPlayerVTO = Static<typeof ProtectedPlayerVTO>

export const DbPlayerVTO = Type.Object({
  key: Type.String(),
  token: Type.Optional(Type.String()),
  username: Type.String(),
  ranch: Type.Union([RanchNameEnum, BonusRanchName]),
  points: Type.Integer(),
  testnetPoints: Type.Integer(),
  medals: Type.Array(Type.Optional(Type.String())),
  id: Type.Optional(Type.String()),
  selectedBufficorn: Type.Integer(),
  creationIndex: Type.Integer(),
  bonusEndsAt: Type.Integer(),
  scannedBonuses: Type.Array(Type.String()),
})

export type DbPlayerVTO = Static<typeof DbPlayerVTO>

export type Stats = Record<Trait, number>

export const ExtendedPlayerVTO = Type.Object({
  player: ProtectedPlayerVTO,
  lastTradeIn: Nullable(DbTradeVTO),
  lastTradeOut: Nullable(DbTradeVTO),
})

export type ExtendedPlayerVTO = Static<typeof ExtendedPlayerVTO>

// Provided index is valid from 0 - 3
export const SelectBufficornParams = Type.Object({
  creationIndex: Type.Integer(),
})
export type SelectBufficornParams = Static<typeof SelectBufficornParams>

// Provided index is valid from 0 - 3
export const SelectBufficornReply = Type.Object({
  creationIndex: Type.Integer(),
})

export type SelectBufficornReply = Static<typeof SelectBufficornReply>

export const BonusParams = Type.Object({
  url: Type.String(),
})
export type BonusParams = Static<typeof BonusParams>

export const BonusReply = Type.Object({
  bonusEndsAt: Type.Number(),
})
export type BonusReply = Static<typeof BonusReply>

export enum BufficornName {
  Bufficorn0 = 'Bufficorn-0',
  Bufficorn1 = 'Bufficorn-1',
  Bufficorn2 = 'Bufficorn-2',
  Bufficorn3 = 'Bufficorn-3',
  Bufficorn4 = 'Bufficorn-4',
  Bufficorn5 = 'Bufficorn-5',
  Bufficorn6 = 'Bufficorn-6',
  Bufficorn7 = 'Bufficorn-7',
  Bufficorn8 = 'Bufficorn-8',
  Bufficorn9 = 'Bufficorn-9',
  Bufficorn10 = 'Bufficorn-10',
  Bufficorn11 = 'Bufficorn-11',
  Bufficorn12 = 'Bufficorn-12',
  Bufficorn13 = 'Bufficorn-13',
  Bufficorn14 = 'Bufficorn-14',
  Bufficorn15 = 'Bufficorn-15',
  Bufficorn16 = 'Bufficorn-16',
  Bufficorn17 = 'Bufficorn-17',
  Bufficorn18 = 'Bufficorn-18',
  Bufficorn19 = 'Bufficorn-19',
  Bufficorn20 = 'Bufficorn-20',
  Bufficorn21 = 'Bufficorn-21',
  Bufficorn22 = 'Bufficorn-22',
  Bufficorn23 = 'Bufficorn-23',
}

export enum Medal {
  Ranch = 'ranch',
  Bufficorn = 'bufficorn',
  Breeder = 'breeder',
  Coat = 'coat',
  Coolness = 'coolness',
  Intelligence = 'intelligence',
  Stamina = 'stamina',
  Vigor = 'vigor',
  Speed = 'speed',
}

export enum Prize {
  RanchGold = 'ranch-gold',
  RanchSilver = 'ranch-silver',
  RanchBronze = 'ranch-bronze',
  RanchStone = 'ranch-stone',

  BufficornGold = 'bufficorn-gold',
  BufficornSilver = 'bufficorn-silver',
  BufficornBronze = 'bufficorn-bronze',

  BreederGold = 'breeder-gold',
  BreederSilver = 'breeder-silver',
  BreederBronze = 'breeder-bronze',
  BreederStone = 'breeder-stone',

  CoatGold = 'coat-gold',
  CoatSilver = 'coat-silver',
  CoatBronze = 'coat-bronze',

  CoolnessGold = 'coolness-gold',
  CoolnessSilver = 'coolness-silver',
  CoolnessBronze = 'coolness-bronze',

  IntelligenceGold = 'intelligence-gold',
  IntelligenceSilver = 'intelligence-silver',
  IntelligenceBronze = 'intelligence-bronze',

  SpeedGold = 'speed-gold',
  SpeedSilver = 'speed-silver',
  SpeedBronze = 'speed-bronze',

  StaminaGold = 'stamina-gold',
  StaminaSilver = 'stamina-silver',
  StaminaBronze = 'stamina-bronze',

  VigorGold = 'vigor-gold',
  VigorSilver = 'vigor-silver',
  VigorBronze = 'vigor-bronze',
}

export enum ResourceFullName {
  WarmHay = 'Warm Hay',
  FreshGrass = 'Fresh Grass',
  SmartSedge = 'Smart Sedge',
  MigthyAcorn = 'Migthy Acorn',
  TirelessWater = 'Tireless Water',
  HeartyBerry = 'Hearty Berry',
}
export const ResourceFullNameEnum = Type.Enum(RanchName)

export const enum MetalName {
  Gold = 'gold',
  Silver = 'silver',
  Bronze = 'bronze',
}

export const MetalNameEnum = Type.Enum(RanchName)

// ##### Best Breeder
export const BestBreederMedalMetadata = Type.Object({
  name: Type.String(),
  description: Type.String(),
  external_url: Type.String(),
  image: Type.String(),
  attributes: Type.Array(
    Type.Union([
      Type.Object({
        trait_type: Type.Literal('Award Category'),
        value: Type.Literal('Best Breeder'),
      }),
      Type.Object({
        display_type: Type.Literal('date'),
        trait_type: Type.Literal('Expedition Date'),
        value: Type.Number(),
      }),
      Type.Object({
        trait_type: Type.Literal('Medal'),
        value: Type.Union([MetalNameEnum, Type.Literal('Diploma')]),
      }),
      Type.Object({
        trait_type: Type.Literal('Farmer Name'),
        value: Type.String(),
      }),
      Type.Object({
        display_type: Type.Literal('number'),
        trait_type: Type.Literal('Farmer Ranking'),
        value: Type.Number(),
      }),
      Type.Object({
        trait_type: Type.Literal('Farmer Score'),
        value: Type.Number(),
      }),
      Type.Object({
        display_type: Type.Literal('boost_percentage'),
        trait_type: ResourceFullNameEnum,
        value: Type.Number(),
      }),
    ])
  ),
})
export type BestBreederMedalMetadata = Static<typeof BestBreederMedalMetadata>

// ##### Best Ranch
export const BestRanchMedalMetadata = Type.Object({
  name: Type.String(),
  description: Type.String(),
  external_url: Type.String(),
  image: Type.String(),
  attributes: Type.Array(
    Type.Union([
      Type.Object({
        trait_type: Type.Literal('Award Category'),
        value: Type.Literal('Best Ranch'),
      }),
      Type.Object({
        display_type: Type.Literal('date'),
        trait_type: Type.Literal('Expedition Date'),
        value: Type.Number(),
      }),
      Type.Object({
        trait_type: Type.Literal('Medal'),
        value: Type.Union([MetalNameEnum, Type.Literal('Diploma')]),
      }),
      Type.Object({
        trait_type: Type.Literal('Farmer Name'),
        value: Type.String(),
      }),
      Type.Object({
        display_type: Type.Literal('date'),
        trait_type: Type.Literal('Ranch Date'),
        value: Type.Number(),
      }),
      Type.Object({
        trait_type: Type.Literal('Ranch Name'),
        value: Type.String(),
      }),
      Type.Object({
        display_type: Type.Literal('number'),
        trait_type: Type.Literal('Ranch Ranking'),
        value: Type.Number(),
      }),
      Type.Object({
        trait_type: Type.Literal('Ranch Score'),
        value: Type.Number(),
      }),
      Type.Object({
        'trait_type:': Type.Literal('Ranch Weather'),
        value: Type.String(),
      }),
    ])
  ),
})
export type BestRanchMedalMetadata = Static<typeof BestRanchMedalMetadata>

// ##### Best <Whatever> Bufficorn
export const BestBufficornMedalMetadata = Type.Object({
  name: Type.String(),
  description: Type.String(),
  external_url: Type.String(),
  image: Type.String(),
  attributes: Type.Array(
    Type.Union([
      Type.Object({
        trait_type: Type.Literal('Award Category'),
        value: Type.String(),
      }),
      Type.Object({
        display_type: Type.Literal('date'),
        trait_type: Type.Literal('Expedition Date'),
        value: Type.Number(),
      }),
      Type.Object({
        trait_type: Type.Literal('Medal'),
        value: MetalNameEnum,
      }),
      Type.Object({
        trait_type: Type.Literal('Farmer Name'),
        value: Type.Literal('Realistic Ilise'),
      }),
      Type.Object({
        trait_type: Type.Literal('Bufficorn Name'),
        value: Type.String(),
      }),
      Type.Object({
        display_type: Type.Literal('number'),
        trait_type: Type.Literal('Bufficorn Ranking'),
        value: Type.Number(),
      }),
      Type.Object({
        trait_type: Type.Literal('Bufficorn Score'),
        value: Type.Number(),
      }),
      Type.Object({
        trait_type: Type.Literal('Bufficorn Coat'),
        value: Type.Number(),
      }),
      Type.Object({
        trait_type: Type.Literal('Bufficorn Coolness'),
        value: Type.Number(),
      }),
      Type.Object({
        trait_type: Type.Literal('Bufficorn Intelligence'),
        value: Type.Number(),
      }),
      Type.Object({
        trait_type: Type.Literal('Bufficorn Speed'),
        value: Type.Number(),
      }),
      Type.Object({
        trait_type: Type.Literal('Bufficorn Stamina'),
        value: Type.Number(),
      }),
      Type.Object({
        trait_type: Type.Literal('Bufficorn Vigor'),
        value: Type.Number(),
      }),
    ])
  ),
})

export type GetTokenInfoResponse = {
  category: number
  ranking: number
}

export type BestBufficornMedalMetadata = Static<
  typeof BestBufficornMedalMetadata
>

export const MedalMetadata = Type.Union([
  BestBreederMedalMetadata,
  BestBufficornMedalMetadata,
  BestRanchMedalMetadata,
])

export type MedalMetadata = Static<typeof MedalMetadata>

export const SvgImage = Type.String()
export type SvgImage = Static<typeof SvgImage>

export const PlayerImagesReponse = Type.Array(
  Type.Object({
    tokenId: Type.String(),
    svg: Type.String(),
  })
)
export type PlayerImagesReponse = Static<typeof PlayerImagesReponse>
