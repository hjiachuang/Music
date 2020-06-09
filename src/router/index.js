import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../layout/Index'
import Recommend from '../views/recommend'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
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
    name: 'Playlist',
    component: () => import('../layout/default.vue'),
    children: [
      {
        path: '/',
        name: 'Playlist-Index',
        component: () => import('../views/playlist/index.vue')
      },
      {
        path: 'detail/:id',
        name: 'Playlist-Detail',
        component: () => import('../views/playlist/detail.vue')
      }
    ]
  },
  {
    path: '/artist',
    name: 'Artist',
    component: () => import('../layout/default.vue'),
    children: [
      {
        path: '/',
        name: 'Artist-Index',
        component: () => import('../views/artist/index.vue')
      },
      {
        path: 'detail/:id',
        name: 'Artist-Detail',
        component: () => import('../views/artist/detail.vue')
      }
    ]
  },
  {
    path: '/album',
    name: 'Album',
    component: () => import('../layout/default.vue'),
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
        component: () => import('../views/album/detail.vue')
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
