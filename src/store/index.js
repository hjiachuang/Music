import Vue from 'vue'
import Vuex from 'vuex'
import player from './modules/player' 
import playlist from './modules/playlist' 
import user from './modules/user' 

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    player,
    playlist,
    user
  }
})
