import { defineStore } from 'pinia'
import { ApiService } from '@/api'
import router from '../router'
import { isMainnetTime } from '../utils'
import {
  TIME_TO_MINT_MILLISECONDS,
  DEMO_ENDS_TIMESTAMP,
  GAME_ENDS_TIMESTAMP
} from '../constants'

export const useStore = defineStore('player', {
  state: () => {
    return {
      api: new ApiService(),
      id: null,
      theme: null,
      medals: [],
      username: '',
      ranch: {},
      selectedBufficorn: null,
      bonus: null,
      tradeInfo: null,
      farmerId: null,
      tradeIn: null,
      tradeOut: null,
      gameOverTimeMilli: GAME_ENDS_TIMESTAMP,
      demoOverTimeMilli: DEMO_ENDS_TIMESTAMP,
      timeToMintInMilli: GAME_ENDS_TIMESTAMP + TIME_TO_MINT_MILLISECONDS,
      previews: [],
      mintedAwards: [],
      tradeHistory: null,
      mintInfo: null,
      mintParams: null,
      color: null,
      tokenIds: null,
      playerPoints: null,
      bufficornsGlobalStats: null,
      playersGlobalStats: null,
      ranchesGlobalStats: null,
      errors: {
        showMintedAwards: null,
        preview: null,
        auth: null,
        trade: null,
        info: null,
        tradeHistory: null,
        getLeaderboardInfo: null,
        network: null,
        getContractArgs: null
      }
    }
  },
  getters: {
    gameOver () {
      //FIXME: make it reactive
      return this.gameOverTimeMilli < Date.now()
    },
    mintingAllow () {
      //FIXME: make it reactive
      return this.timeToMintInMilli < Date.now()
    },
    minted () {
      if (this.mintInfo && this.mintInfo.events && this.mintInfo.events[1]) {
        return true
      } else {
        return false
      }
    },
    demoOver () {
      //FIXME: make it reactive
      return this.demoOverTimeMilli < Date.now()
    },
    isMainnetTime () {
      return isMainnetTime()
    }
  },
  actions: {
    notify (payload) {
      this.app.config.globalProperties.$notify(payload)
    },
    saveClaimInfo (info) {
      localStorage.setItem(
        'tokenInfo',
        JSON.stringify({ ...this.getToken(), ...info })
      )
    },
    setTokenIds (tokenIds) {
      console.log('setTokenIds!', tokenIds)
      this.tokenIds = tokenIds
    },
    savePreview (preview) {
      localStorage.setItem('preview', preview)
      this.preview = preview
    },
    saveTheme (theme) {
      localStorage.setItem('theme', theme)
      this.theme = theme
    },
    saveMintInfo (info) {
      console.log('mintInfo!', info)
      localStorage.setItem('mintInfo', JSON.stringify({ ...info }))
      this.mintInfo = info
    },
    getTheme () {
      const theme = localStorage.getItem('theme')
      if (theme) {
        this.theme = theme
      }
    },
    getMintInfo () {
      const mintInfo = JSON.parse(localStorage.getItem('mintInfo'))
      if (mintInfo) {
        this.mintInfo = mintInfo
      }
    },
    getToken () {
      return JSON.parse(localStorage.getItem('tokenInfo'))
    },
    clearTokenInfo () {
      localStorage.removeItem('tokenInfo')
      localStorage.removeItem('theme')
    },
    clearError (error) {
      this.errors[error] = null
    },
    setError (name, error) {
      this.errors[name] = error.response?.data?.message || error.toString()
      this.notify({ message: this.errors[name] })
    },
    async authorize ({ key }) {
      const request = await this.api.authorize({ key })
      if (request.error) {
        router.push('/init-game')
        this.setError('auth', request.error)
      } else if (request.token) {
        await this.saveClaimInfo(request)
        // await this.saveMintInfo(request.)
        this.clearError('auth')
        await this.getPlayerInfo()
        await this.getGlobalStats()
      }
    },
    breed ({ bufficorns }) {
      this.ranch.bufficorns = bufficorns
    },
    async trade ({ key }) {
      const tokenInfo = this.getToken()
      const request = await this.api.trade({
        token: tokenInfo.token,
        to: key
      })
      if (request.error) {
        this.setError('trade', request.error)
        router.push('/init-game')
      } else {
        this.clearError('trade')
        this.tradeInfo = request
        router.push('/init-game')
        await this.getPlayerInfo()
      }
    },
    async updateSelectedBufficorn (index) {
      const tokenInfo = this.getToken()
      if (index !== this.selectedBufficorn) {
        const request = await this.api.selectBufficorn({
          token: tokenInfo.token,
          bufficorn: index
        })
        if (request.error) {
          this.setError('updateSelectedBufficorn', request.error)
          router.push('/init-game')
        } else {
          this.clearError('updateSelectedBufficorn')
          this.selectedBufficorn = request
          await this.getPlayerInfo()
        }
      }
    },
    async getMintedAwardsImages () {
      const tokenInfo = this.getToken()
      if (this.tokenIds) {
        const request = await this.api.getMintedAwardsImages({
          token: tokenInfo.token,
          tokenIds: this.tokenIds
        })
        console.log('mintedAwards!', request)
        if (request.error) {
          this.setError('showMintedAwards', request.error)
          router.push('/init-game')
        } else {
          this.clearError('showMintedAwards')
          this.mintedAwards = request
        }
      }
    },
    async getPreviews () {
      const tokenInfo = this.getToken()
      const request = await this.api.getPreviews({
        token: tokenInfo.token,
        key: this.id
      })
      console.log('getPreview!', request)
      if (request.error) {
        this.setError('preview', request.error)
        router.push('/init-game')
      } else {
        this.clearError('preview')
        this.previews = request
      }
    },
    async getBonus (url) {
      const tokenInfo = this.getToken()
      const request = await this.api.getBonus({
        token: tokenInfo.token,
        url
      })
      if (request.error) {
        this.setError('bonus', request.error)
        router.push('/init-game')
      } else {
        this.clearError('bonus')
        await this.getPlayerInfo()
      }
    },
    async getGlobalStats (offset = 0, limit = 25) {
      await this.getTheme()
      await this.getPlayerInfo()
      const request = await this.api.getLeaderboardInfo({
        offset,
        limit
      })
      if (request.error) {
        this.setError('getLeaderboardInfo', request.error)
      } else {
        this.clearError('getLeaderboardInfo')
        this.bufficornsGlobalStats = request.bufficorns
        this.playersGlobalStats = request.players
        this.ranchesGlobalStats = request.ranches
      }
    },
    async getTradeHistory (offset = 0, limit = 25) {
      await this.getTheme()
      const tokenInfo = this.getToken()
      const request = await this.api.getTradeHistory({
        token: tokenInfo && tokenInfo.token,
        id: tokenInfo && tokenInfo.key,
        offset,
        limit
      })
      if (request.error) {
        router.push('/init-game')
        this.setError('tradeHistory', request.error)
      } else {
        this.clearError('tradeHistory')
        this.tradeHistory = request.trades
      }
    },
    async getPlayerInfo () {
      const tokenInfo = this.getToken()
      const request = await this.api.getInfo({
        token: tokenInfo && tokenInfo.token,
        id: tokenInfo && tokenInfo.key
      })
      if (request.error) {
        router.push({ name: 'init-game' })
        this.setError('info', request.error)
      } else {
        this.clearError('info')
        const {
          key,
          username,
          ranch,
          selectedBufficorn,
          points,
          testnetPoints,
          bonusEndsAt,
          creationIndex
        } = request.player
        this.bonus = bonusEndsAt
        this.id = key
        this.username = username
        this.ranch = ranch
        this.playerPoints = testnetPoints
        this.selectedBufficorn = selectedBufficorn
        this.farmerId = creationIndex

        this.saveTheme(ranch.name)
        if (request.lastTradeIn) {
          this.tradeIn = request.lastTradeIn
        }
        if (request.lastTradeOut) {
          this.tradeOut = request.lastTradeOut
        }
      }
    },
    async getContractArgs (address) {
      const tokenInfo = this.getToken()
      const request = await this.api.getContractArgs({
        address,
        token: tokenInfo.token
      })
      console.log('getContractArgs', request)
      if (request.error) {
        router.push({ name: 'init-game' })
        this.setError('getContractArgs', request.error)
      } else {
        this.mintParams = request
        return this.mintParams
      }
    }
  }
})
