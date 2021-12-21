import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import MyEgg from '../views/MyEgg.vue'
import InitGame from '../views/InitGame.vue'
import Disclaimer from '../views/Disclaimer.vue'
import { useEggStore } from '@/stores/egg'
import { createApp } from 'vue'
import ScanEgg from '../views/ScanEgg.vue'
import App from '@/App.vue'
import { createPinia } from 'pinia'

export const pinia = createPinia()

const app = createApp(App)
app.use(pinia)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: async (to, from, next) => {
      const store = useEggStore()
      const eggLoginInfo = store.getToken()
      if (eggLoginInfo && eggLoginInfo.token) {
        console.log(eggLoginInfo, eggLoginInfo.token)
        next({ name: 'egg', params: { id: eggLoginInfo.key } })
      } else {
        console.log('init game')
        next('init-game')
      }
    }
  },
  {
    name: 'disclaimer',
    path: '/disclaimer',
    component: Disclaimer
  },
  {
    name: 'egg',
    path: '/egg/:id',
    component: MyEgg
  },
  {
    name: 'init-game',
    path: '/init-game',
    component: InitGame
  },
  {
    path: '/scan-egg',
    component: ScanEgg
  },
  {
    name: 'import',
    path: '/import',
    beforeEnter: (to, from, next) => {
      console.log('to', to)
      const { username, token, key } = to.query

      if (!username || !token || !key) {
        next('/')
      } else {
        localStorage.setItem(
          'tokenInfo',
          JSON.stringify({ username, token, key })
        )

        next(`/egg/${key}`)
      }
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(to => {
  const eggStore = useEggStore()

  if (to.meta.requiresAuth && !eggStore.isLoggedIn) return '/login'
})

export default router
