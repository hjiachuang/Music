export default {
    namespaced: true,

    //模块内容
    state:{
        playlist_id: null,  //播放列表id
        playlist_list: [],  //播放列表

    },

    mutations: {
        //设置播放列表和播放列表id
        setPlayLists(state, lists) {
            state.playlist_list = lists.lists
            state.playlist_id = lists.id
        },
        canPlay(state, index) {
            state.playlist_list[index].canPlay = false
        }
    },

    actions: {
        clearPlaylist({ commit }) {
            //清空state中的数据
            commit("setPlayLists", {
                lists: [],
                id: null
            })
            //清空播放器信息停止播放
            commit("player/clearPlayer",null,{root: true})
        },
        deleteSong({ commit, dispatch, state, rootState }, id) {
            const tempList = JSON.parse(JSON.stringify(state.playlist_list))
            tempList.forEach((v, i) => {
                if(v.mid === id) {
                    tempList.splice(i, 1)
                    if(rootState.player.play_id === id) {
                        dispatch("player/next", null, {root: true})
                    }
                    if(rootState.player.play_previous_index >= i) {
                        commit("player/setPlayPreviousIndex", rootState.player.play_previous_index - 1, {root: true})
                    }
                }
            })
            if(rootState.player.play_id === id) {
                dispatch("player/next", null, {root: true})
                commit("player/setPlayPreviousIndex", rootState.player.play_previous_index - 1, {root: true})
            }
            commit("setPlayLists", {
                lists: tempList,
                id: state.playlist_id
            })
        }
    },

    getters: {}
}