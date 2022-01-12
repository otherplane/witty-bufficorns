import { defineStore } from 'pinia'
import { WittyCreaturesApi } from '@/api'
import router from '../router'
import { isThisSecond } from 'date-fns'

export const useStore = defineStore('player', {
  state: () => {
    return {
      api: new WittyCreaturesApi(),
      id: null,
      medals: [],
      username: '',
      ranch: {},
      selectedBufficorn: null,
      trade: null,
      gameOverTimeMilli: 1645380000000,
      creaturePreview: null,
      mintInfo: null,
      color: null,
      creatureData: null,
      errors: {
        auth: null,
        trade: null,
        info: null
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
    setCreatureData (data) {
      this.creatureData = data
    },
    savePreview (creature) {
      localStorage.setItem('creature', creature)
      this.creaturePreview = creature
    },
    saveMintInfo (info) {
      localStorage.setItem('mintInfo', JSON.stringify({ ...info }))
      this.mintInfo = info
    },
    getPreview () {
      const preview = localStorage.getItem('creature')
      if (preview) {
        this.creaturePreview = preview
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
        this.getInfo()
        router.push('/')
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
          router.push({ name: 'init-game' })
          this.setError('info', request.error)
        } else {
          this.clearError('info')
          const { key, username, ranch } = request
          this.id = key
          this.username = username
          this.ranch = ranch
          if (!this.selectedBufficorn) {
            this.selectedBufficorn = ranch.bufficorns[0].name
          }

          if (this.id !== router.currentRoute.value.params.id) {
            router.push({
              name: 'trade',
              params: { id: router.currentRoute.value.params.id }
            })
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

      this.mintInformation = request

      return this.mintCreatureParams
    }
  }
})
