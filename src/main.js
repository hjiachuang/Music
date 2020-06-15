import Vue from 'vue'
import router from './router'
import store from './store'

import App from './App.vue'

import './plugins/axios'
import vuetify from './plugins/vuetify'
import Tool from './plugins/tool'
import Filter from './plugins/filter'

import './assets/scss/custom.scss'
import './assets/icomoon/style.css'
import './plugins/element.js'

Vue.config.productionTip = false

//全局注册自定义工具 js
Vue.use(Tool)

//初始化store
store.commit("player/setPlayer")
store.dispatch("user/getUser")

//全局注册过滤器
Object.keys(Filter).forEach(key => {  
  Vue.filter(key, Filter[key])  
})


new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
