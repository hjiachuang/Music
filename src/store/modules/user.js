export default {
    namespaced: true,

    //模块内容
    state:{
        all: null,
        userId: "",
        userName: "",
        userGender: "",
        userLogo: "",
        token: ""
    },

    mutations: {
        setUser(state, data) {
            state.userId = data.userId
            state.userName = data.userName,
            state.userGender = data.userGender,
            state.userLogo = data.userLogo,
            state.token = data.token,
            state.all = data.user
        }
    },

    actions: {
        setUser({ commit }, data) {
            const temp = {
                userId: data.profile.userId,
                userName: data.profile.nickname,
                userGender: data.profile.gender,
                userLogo: data.profile.avatarUrl,
                token: data.token,
                user: data
            }
            commit("setUser", temp)
            window.localStorage.setItem("user", JSON.stringify(temp))
        },
        getUser({ commit }) {
            if(window.localStorage.getItem("user")) {
                const user = window.localStorage.getItem("user")
                commit("setUser", JSON.parse(user))
            }
        },
        loginOut({ commit}) {
            commit("setUser", {
                all: null,
                userId: "",
                userName: "",
                userGender: "",
                userLogo: "",
                token: ""
            })
            window.localStorage.removeItem("user")
        }
    },

    getters: {}
}