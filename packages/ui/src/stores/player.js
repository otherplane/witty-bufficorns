import { defineStore } from 'pinia'
import { ApiService } from '@/api'
import router from '../router'
import { isThisSecond } from 'date-fns'

export const useStore = defineStore('player', {
  state: () => {
    return {
      api: new ApiService(),
      id: null,
      medals: [],
      username: '',
      ranch: {},
      selectedBufficorn: null,
      tradeInfo: null,
      tradeIn: null,
      tradeOut: null,
      gameOverTimeMilli: 1645380000000,
      preview: null,
      tradeHistory: null,
      mintInfo: null,
      mintParams: null,
      color: null,
      data: null,
      playerPoints: null,
      bufficornsGlobalStats: null,
      playersGlobalStats: null,
      ranchesGlobalStats: null,
      errors: {
        auth: null,
        trade: null,
        info: null,
        tradeHistory: null,
        getLeaderboardInfo: null
      }
    }
  },
  getters: {
    gameOver () {
      //FIXME: make it reactive
      return this.gameOverTimeMilli < Date.now()
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
    setData (data) {
      this.data = data
    },
    savePreview (preview) {
      localStorage.setItem('preview', preview)
      this.preview = preview
    },
    saveMintInfo (info) {
      localStorage.setItem('mintInfo', JSON.stringify({ ...info }))
      this.mintInfo = info
    },
    getPreview () {
      const preview = localStorage.getItem('preview')
      if (preview) {
        this.preview = preview
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
    clearError (error) {
      this.errors[error] = null
    },
    setError (name, error) {
      this.errors[name] = error.response.data.message
      this.notify({ message: this.errors[name] })
    },
    async authorize ({ key }) {
      const request = await this.api.authorize({ key })
      if (request.error) {
        router.push({ name: 'init-game' })
        this.setError('auth', request.error)
      } else if (request.token) {
        await this.saveClaimInfo(request)
        this.clearError('auth')
        this.getInfo()
      }
    },
    breed ({ bufficorns }) {
      this.ranch.bufficorns = bufficorns
    },
    async trade ({ key }) {
      const tokenInfo = this.getToken()
      const request = await this.api.trade({
        token: tokenInfo.token,
        to: key,
        bufficorn: this.selectedBufficorn
      })
      if (request.error) {
        this.setError('trade', request.error)
        router.push('/')
      } else {
        this.clearError('trade')
        this.tradeInfo = request
        this.getInfo()
        router.push('/')
      }
    },
    async updateSelectedBufficorn (index) {
      const tokenInfo = this.getToken()
      const request = await this.api.selectBufficorn({
        token: tokenInfo.token,
        bufficorn: index
      })
      if (request.error) {
        this.setError('updateSelectedBufficorn', request.error)
        router.push('/')
      } else {
        this.clearError('updateSelectedBufficorn')
        this.selectedBufficorn = request
        this.getInfo()
        router.push('/')
      }
    },
    async getGlobalStats () {
      const request = await this.api.getLeaderboardInfo()
      if (request.error) {
        this.setError('getLeaderboardInfo', request.error)
      } else {
        this.clearError('getLeaderboardInfo')
        this.bufficornsGlobalStats = request.bufficorns
        this.playersGlobalStats = request.players
        this.ranchesGlobalStats = request.ranches
      }
    },
    async getTradeHistory () {
      const tokenInfo = this.getToken()
      const request = await this.api.getTradeHistory({
        token: tokenInfo && tokenInfo.token,
        id: tokenInfo && tokenInfo.key
      })
      if (request.error) {
        router.push('/init-game')
        this.setError('tradeHistory', request.error)
      } else {
        this.clearError('tradeHistory')
        this.tradeHistory = request.trades
      }
    },
    async getInfo () {
      const tokenInfo = this.getToken()
      if (tokenInfo) {
        const request = await this.api.getInfo({
          token: tokenInfo && tokenInfo.token,
          id: tokenInfo && tokenInfo.key
        })
        if (request.error) {
          router.push('/init-game')
          this.setError('info', request.error)
        } else {
          this.clearError('info')
          const {
            key,
            username,
            ranch,
            selectedBufficorn,
            points
          } = request.player
          console.log(request.player)
          this.id = key
          this.username = username
          this.ranch = ranch
          this.playerPoints = points
          this.selectedBufficorn = selectedBufficorn
          if (request.lastTradeIn) {
            this.tradeIn = request.lastTradeIn
          }
          if (request.lastTradeOut) {
            this.tradeOut = request.lastTradeOut
          }
          if (!this.selectedBufficorn) {
            this.selectedBufficorn = 0
          }
          if (this.id !== router.currentRoute.value.params.id) {
            this.trade({ key: router.currentRoute.value.params.id })
          }
        }
      } else {
        this.authorize({ key: router.currentRoute.value.params.id })
      }
    },
    async getContractArgs (address) {
      const tokenInfo = this.getToken()
      const request = await this.api.getContractArgs({
        address,
        token: tokenInfo.token
      })
      this.mintParams = request
      return this.mintParams
    }
  }
})
