import fs from 'fs'
import { GetTokenInfoReponse, Medal, MetalName } from './types'

export class SvgService {
  static getSvg({ category, ranking }: GetTokenInfoReponse): string {
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

    let medalMetal: MetalName | 'stone'

    switch (ranking) {
      case 1:
        medalMetal = MetalName.Gold
        break
      case 2: {
        medalMetal = MetalName.Silver
        break
      }
      case 3: {
        medalMetal = MetalName.Bronze
        break
      }
      default:
        medalMetal = 'stone'
    }
    const svgName = `${categoryToMedal[category as number]}-${medalMetal}.svg`

    return fs.readFileSync(`./assets/${svgName}`, {
      encoding: 'utf-8',
    })
  }
}
