import { GetTokenInfoResponse, Medal, MetalName, Prize } from './types'

import RanchGold from './assets/ranch-gold'
import RanchSilver from './assets/ranch-silver'
import RanchBronze from './assets/ranch-bronze'
import RanchStone from './assets/ranch-stone'

import BufficornGold from './assets/bufficorn-gold'
import BufficornSilver from './assets/bufficorn-silver'
import BufficornBronze from './assets/bufficorn-bronze'

import BreederGold from './assets/breeder-gold'
import BreederSilver from './assets/breeder-silver'
import BreederBronze from './assets/breeder-bronze'
import BreederStone from './assets/breeder-stone'

import CoatBufficornGold from './assets/coat-gold'
import CoatBufficornSilver from './assets/coat-silver'
import CoatBufficornBronze from './assets/coat-bronze'

import CoolnessBufficornGold from './assets/coolness-gold'
import CoolnessBufficornSilver from './assets/coolness-silver'
import CoolnessBufficornBronze from './assets/coolness-bronze'

import IntelligenceBufficornGold from './assets/intellect-gold'
import IntelligenceBufficornSilver from './assets/intellect-silver'
import IntelligenceBufficornBronze from './assets/intellect-bronze'

import SpeedBufficornGold from './assets/speed-gold'
import SpeedBufficornSilver from './assets/speed-silver'
import SpeedBufficornBronze from './assets/speed-bronze'

import StaminaBufficornGold from './assets/stamina-gold'
import StaminaBufficornSilver from './assets/stamina-silver'
import StaminaBufficornBronze from './assets/stamina-bronze'

import VigorBufficornGold from './assets/vigor-gold'
import VigorBufficornSilver from './assets/vigor-silver'
import VigorBufficornBronze from './assets/vigor-bronze'

const medalNameToSvg: Record<Prize, any> = {
  'ranch-gold': RanchGold,
  'ranch-silver': RanchSilver,
  'ranch-bronze': RanchBronze,
  'ranch-stone': RanchStone,

  'bufficorn-gold': BufficornGold,
  'bufficorn-silver': BufficornSilver,
  'bufficorn-bronze': BufficornBronze,

  'breeder-gold': BreederGold,
  'breeder-silver': BreederSilver,
  'breeder-bronze': BreederBronze,
  'breeder-stone': BreederStone,

  'coat-gold': CoatBufficornGold,
  'coat-silver': CoatBufficornSilver,
  'coat-bronze': CoatBufficornBronze,

  'coolness-gold': CoolnessBufficornGold,
  'coolness-silver': CoolnessBufficornSilver,
  'coolness-bronze': CoolnessBufficornBronze,

  'intelligence-gold': IntelligenceBufficornGold,
  'intelligence-silver': IntelligenceBufficornSilver,
  'intelligence-bronze': IntelligenceBufficornBronze,

  'speed-gold': SpeedBufficornGold,
  'speed-silver': SpeedBufficornSilver,
  'speed-bronze': SpeedBufficornBronze,

  'stamina-gold': StaminaBufficornGold,
  'stamina-silver': StaminaBufficornSilver,
  'stamina-bronze': StaminaBufficornBronze,

  'vigor-gold': VigorBufficornGold,
  'vigor-silver': VigorBufficornSilver,
  'vigor-bronze': VigorBufficornBronze,
}

export class SvgService {
  static getSvgName({ category, ranking }: GetTokenInfoResponse): Prize {
    const categoryToMedal: Record<number, Medal> = {
      0: Medal.Breeder,
      1: Medal.Ranch,
      2: Medal.Bufficorn,
      3: Medal.Coat,
      4: Medal.Coolness,
      5: Medal.Intelligence,
      6: Medal.Speed,
      7: Medal.Stamina,
      8: Medal.Vigor,
    }
    console.log('category', typeof category, 'ranking', typeof ranking)
    let medalMetal: MetalName | 'stone'

    switch (ranking) {
      case 1:
        medalMetal = MetalName.Gold
        console.log('medalMetal1', medalMetal)
        break
      case 2: {
        medalMetal = MetalName.Silver
        console.log('medalMetal2', medalMetal)
        break
      }
      case 3: {
        medalMetal = MetalName.Bronze
        console.log('medalMetal3', medalMetal)
        break
      }
      default:
        medalMetal = 'stone'
        console.log('medalMetaldefault', medalMetal)
    }
    console.log('medalMetaldefault', medalMetal)
    const svgName = `${
      categoryToMedal[category as number]
    }-${medalMetal}` as Prize

    return svgName
  }

  static getSVGFromName(name: Prize, ranking: string): string {
    console.log(name, ranking, medalNameToSvg[name])
    return medalNameToSvg[name].replace('#9999', `#${ranking}`)
  }

  static getSVG({ category, ranking }: GetTokenInfoResponse): string {
    return medalNameToSvg[this.getSvgName({ category, ranking })].replace(
      '#9999',
      `#${ranking}`
    )
  }
}
