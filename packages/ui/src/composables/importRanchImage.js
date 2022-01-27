import { RANCHES } from '../constants'
export const ranchImage = name => {
  return new URL(`/src/assets/${RANCHES[name]}.svg`, import.meta.url).href
}
