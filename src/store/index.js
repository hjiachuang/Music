import Vue from 'vue'
import Vuex from 'vuex'
import player from './modules/player' 
import playlist from './modules/playlist'
import load from './modules/load'

import playerTemp from './modules/playerTemp'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    player,
    playlist,
    load,
    playerTemp
  }
})
