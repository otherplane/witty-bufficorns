import { BASE_URL } from '../constants'

export function createImportLink () {
  const { key, username, token } = JSON.parse(localStorage.getItem('tokenInfo'))
  const mintInfo = JSON.parse(localStorage.getItem('mintInfo'))
  if (mintInfo) {
    return `${BASE_URL}/#/import?key=${key}&username=${username}&token=${token}&transactionHash=${mintInfo.transactionHash}&blockHash=${mintInfo.transactionHash}`
  } else {
    return `${BASE_URL}/#/import?key=${key}&username=${username}&token=${token}`
  }
}
