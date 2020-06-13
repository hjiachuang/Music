import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../layout/Index'
import Recommend from '../views/recommend'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Index,
    children: [
      {
        path: '/',
        redirect: 'recommend'
      },
      {
        path: 'recommend',
        name: 'Recommend',
        component: Recommend
      },
      {
        path: 'rank',
        name: 'Rank',
        component: () => import('../views/rank')
      },
      {
        path: 'search',
        name: 'Search',
        component: () => import('../views/search')
      }
    ]
  },
  {
    path: '/playlist',
    component: () => import('../layout/default'),
    children: [
      {
        path: '/',
        name: 'Playlist-Index',
        component: () => import('../views/playlist/index')
      },
      {
        path: 'detail/:id',
        name: 'Playlist-Detail',
        component: () => import('../views/playlist/detail')
      }
    ]
  },
  {
    path: '/artist',
    component: () => import('../layout/default'),
    children: [
      {
        path: '/',
        name: 'Artist-Index',
        component: () => import('../views/artist/index')
      },
      {
        path: 'detail/:id',
        name: 'Artist-Detail',
        component: () => import('../views/artist/detail')
      }
    ]
  },
  {
    path: '/album',
    component: () => import('../layout/default'),
    children: [
      {
        path: '/',
        redirect: 'new'

      },
      {
        path: 'new',
        name: 'Album-New',
        component: () => import('../views/album/new')

      },
      {
        path: 'detail/:id',
        name: 'Album-Detail',
        component: () => import('../views/album/detail')
      }
    ]
  },
  {
    path: '/mv',
    component: () => import('../layout/default'),
    children: [
      {
        path: '/',
        name: 'Mv-Index',
        component: () => import('../views/mv/index')

      },
      {
        path: 'detail/:id',
        name: 'Mv-Detail',
        component: () => import('../views/mv/detail')
      }
    ]
  },
  {
    path: '/song',
    component: () => import('../layout/only'),
    children: [
      {
        path: '/',
        redirect: '/recommend'
      },
      {
        path: ':id',
        name: 'Song',
        component: () => import('../views/song')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
