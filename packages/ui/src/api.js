import axios from 'axios'

import { API_BASE_URL } from './constants'

export class ApiService {
  constructor () {
    this.baseUrl = API_BASE_URL
  }

  _handleResponse (response) {
    if (response && response.data) {
      return response.data
    }
  }

  _handleError (error) {
    return { error }
  }

  _get ({ url, params }) {
    return axios
      .get(url, params)
      .then(this._handleResponse)
      .catch(this._handleError)
  }

  _post ({ url, data, params }) {
    return axios
      .post(url, data, params)
      .then(this._handleResponse)
      .catch(this._handleError)
  }

  authorize (params) {
    return this._post({
      url: `${this.baseUrl}/auth`,
      data: { key: params.key }
    })
  }

  getInfo (params) {
    return this._get({
      url: `${this.baseUrl}/players/${params.id}`,
      params: { headers: { authorization: params.token } }
    })
  }

  getTradeHistory (params) {
    return this._get({
      url: `${this.baseUrl}/trades`,
      params: { headers: { authorization: params.token } }
    })
  }

  getLeaderboardInfo (params) {
    return this._get({
      url: `${this.baseUrl}/leaderboard`,
      data: { offset: params.offset, limit: params.limit }
    })
  }

  selectBufficorn ({ token, bufficorn }) {
    return this._post({
      url: `${this.baseUrl}/players/selected-bufficorn/${bufficorn}`,
      params: { headers: { authorization: token } }
    })
  }

  trade ({ bufficorn, to, token }) {
    return this._post({
      url: `${this.baseUrl}/trades`,
      data: { to },
      params: { headers: { authorization: token } }
    })
  }

  getContractArgs ({ address, token }) {
    return this._post({
      url: `${this.baseUrl}/mint`,
      data: { address },
      params: { headers: { authorization: token } }
    })
  }
}
