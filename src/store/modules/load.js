export default {
    namespaced: true,

    //模块内容
    state:{
        loading: false
    },

    mutations: {
        setLoad(state, bool = true) {
            state.loading = bool
        }
    },

    actions: {
        endLoad({ commit }) {
            setTimeout(() => {
                commit("setLoad", false)
            }, 500)
        }
    },

    getters: {}
}