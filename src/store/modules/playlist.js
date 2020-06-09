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
    },

    actions: {},

    getters: {}
}