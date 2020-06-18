export default {
    namespaced: true,

    //模块内容
    state: {
        player: null,               //播放器
        player_timer: null,         //播放器定时器
        playing: false,             //是否播放中
        play_id: "",                //播放歌曲id
        play_name: "",              //播放歌曲名
        play_articles: [],          //播放歌曲歌手数组
        play_album: "",             //播放歌曲专辑名
        play_link: "",              //播放歌曲链接
        play_img: "",               //播放歌曲专辑封面
        play_link_expire: "",       //播放歌曲链接过期时间
        play_pattern: "List Loop",  //播放模式  "Singles Loop": 单曲循环; "List Loop": 列表循环; "Random Play": 随机播放;
        play_previous_index: 0      //上一个播放编号 
    },

    mutations: {
        //给vuex添加一个audio对象
        setPlayer(state) {
            let player = new Audio()
            player.preload = "auto"
            state.player = player
        },
        //设置当前播放歌曲信息
        setPlayMessage(state, { id, name, articles, album, link, img}) {
            if(id !== undefined) {
                if(id !== state.play_id) {
                    state.play_id = id
                }else {
                    if(link !== undefined && link !== "") {
                        const date = new Date(new Date().getTime() + 600000)
                        state.play_link = link
                        state.play_link_expire = date
                    }
                    return
                }
            }
            if(name !== undefined) {
                state.play_name = name
            }
            if(articles !== undefined) {
                state.play_articles = articles
            }
            if(album !== undefined) {
                state.play_album = album
            }
            if(link !== undefined) {
                if(link === ""){
                    state.play_link = ""
                    state.play_link_expire = ""
                }else {
                    const date = new Date(new Date().getTime() + 600000)
                    state.play_link = link
                    state.play_link_expire = date
                }
            }
            if(img !== undefined) {
                state.play_img = img
            }
        },
        //设置当前播放的定时器
        setTimer(state, timer) {
            state.player_timer = timer
        },
        //设置当前歌曲在播放列表的位置
        setPlayPreviousIndex(state, index) {
            state.play_previous_index = index
        },
        //设置当前播放模式
        setPlayPattern(state, pattern) {
            state.play_pattern = pattern
        },
        //设置当前播放状态
        setPlaying(state, playing) {
            state.playing = playing
        },
        //播放（播放控制）
        play(state) {
            if(state.player.src === state.play_link) {
                if(state.player.paused) {
                    state.player.play()
                    state.playing = true
                    this.dispatch('player/setTimer')
                }else if(state.player.ended){
                    state.player.load()
                    state.player.play()
                    state.playing = true
                    this.dispatch('player/setTimer')
                }
            }else {
                state.player.src = state.play_link
                state.player.load()
                state.player.play()
                state.playing = true
                this.dispatch('player/setTimer')
            }
        },
        //暂停
        pause(state) {
            if(!state.player.paused) {
                state.player.pause()
                clearTimeout(state.player_timer)
                state.playing = false
            }
        },
        clearPlayer(state) {
            state.playing = false
            state.play_id = ""
            state.play_name = ""
            state.play_articles = []
            state.play_album = ""
            state.play_link = ""
            state.play_img = ""
            state.play_previous_index = 0
            state.player.src = ""
            state.player.load()
        }
    },

    actions: {
        //播放（新播放）
        async play({ dispatch, commit, state, rootState }) {
            if(state.play_id !== "" && state.play_id === rootState.playlist.playlist_list[state.play_previous_index].mid) {
                if(state.play_link_expire < new Date()) {
                    const link_data = await axios.post("/url/search",{
                        songName: rootState.playlist.playlist_list[state.play_previous_index].name || rootState.playlist.playlist_list[state.play_previous_index].songname,
                        songAlbum: rootState.playlist.playlist_list[state.play_previous_index].album.title || rootState.playlist.playlist_list[state.play_previous_index].albumname
                    })
                    if(link_data.status === 200 && link_data.data.code === 1) {
                        const link = link_data.data.result
                        commit('setPlayMessage',{
                            id: state.play_id,
                            link: link
                        })
                        commit('play')
                    }
                }else {
                    commit('play')
                }
            }else {
                const songName = rootState.playlist.playlist_list[state.play_previous_index].name || rootState.playlist.playlist_list[state.play_previous_index].songName
                const songAlbum = rootState.playlist.playlist_list[state.play_previous_index].album ? rootState.playlist.playlist_list[state.play_previous_index].album.title : rootState.playlist.playlist_list[state.play_previous_index].albumname
                const link_data = await axios.post("/url/search",{
                    songName, songAlbum
                })
                if(link_data.status === 200 && link_data.data.code === 1) {
                    const link = link_data.data.result
                    if(link === null) {
                        dispatch('next')
                        return
                    }
                    commit('setPlayMessage',{
                        id: rootState.playlist.playlist_list[state.play_previous_index].mid,
                        name: rootState.playlist.playlist_list[state.play_previous_index].name,
                        articles: rootState.playlist.playlist_list[state.play_previous_index].singer,
                        album: rootState.playlist.playlist_list[state.play_previous_index].album.name,
                        link: link,
                        img: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${rootState.playlist.playlist_list[state.play_previous_index].album.pmid}.jpg?max_age=2592000`
                    })
                    commit('play')
                }else {
                    dispatch('next')
                }
            }
        },
        //主入口
        /*
        * options: {
        *   type: "empty" or "add"  传递过来的歌曲列表是要替换当前播放列表还是添加进播放列表
        *   lists_id: String        传递过来的歌曲列表的唯一ID
        *   lists: Array            传递过来的歌曲列表
        *   index: Number           在这个歌曲列表想播放的那首歌的位置
        * }
        * */
        index({ dispatch, commit, state, rootState }, options) {
            if(options.type === "empty") {
                if(options.lists_id === rootState.playlist.playlist_id) {
                    if(options.lists[options.index].mid === state.play_id) {
                        dispatch('play')
                    }else {
                        commit('setPlayPreviousIndex', parseInt(options.index))
                        dispatch('play')
                    }
                }else {
                    commit("playlist/setPlayLists",{
                        lists :options.lists,
                        id: options.lists_id
                    },{root: true})
                    commit('setPlayPreviousIndex', parseInt(options.index))
                    dispatch('play')
                }
            }else if(options.type === "add") {
                const tempLists = JSON.parse(JSON.stringify(rootState.playlist.playlist_list))
                if(tempLists.length === 0) {
                    tempLists.push(options.lists[options.index])
                    commit('playlist/setPlayLists', {
                        lists: tempLists,
                        id: rootState.playlist.playlist_id
                    }, {root: true})
                    commit('setPlayPreviousIndex', 0)
                    dispatch('play')
                    return
                }
                for(let i in tempLists) {
                    if(tempLists[i].mid === options.lists[options.index].mid){
                        if(state.play_previous_index !== i) {
                            commit('setPlayPreviousIndex', parseInt(i))
                        }
                        dispatch('play')
                        return
                    }
                }
                const tempIndex = state.play_previous_index + 1
                tempLists.splice(tempIndex,0,options.lists[options.index])
                commit('playlist/setPlayLists', {
                    lists: tempLists,
                    id: rootState.playlist.playlist_id
                }, {root: true})
                commit('setPlayPreviousIndex', parseInt(tempIndex))
                dispatch('play')
            }
        },
        //设置播放定时器
        setTimer({ commit, dispatch, state }) {
            clearTimeout(state.player_timer)
            state.player.oncanplay = () => {
                const duration = state.player.duration
                const currentTime = state.player.currentTime
                const timer = setTimeout(() => {
                    dispatch('next')
                }, (duration - currentTime + 1) * 1000)
                commit('setTimer',timer)
            }

        },
        //下一首
        async next({ commit, dispatch, state, rootState }) {
            clearTimeout(state.player_timer)
            if(rootState.playlist.playlist_list.length <=1) {
                state.player.load()
                commit('play')
                return
            }
            const length = rootState.playlist.playlist_list.length
            const pattern = state.play_pattern
            if(pattern === "List Loop") {
                let index = state.play_previous_index
                if(index < length - 1) {
                    index += 1
                }else {
                    index = 0
                }
                commit('setPlayPreviousIndex', index)
                dispatch('play')
            }else if(pattern === "Singles Loop") {
                dispatch('play')
            }else if(pattern === "Random Play") {
                let index = Math.floor(Math.random()*(length))
                while(index === state.play_previous_index) {
                    index = Math.floor(Math.random()*(length))   
                }
                commit('setPlayPreviousIndex', index)
                dispatch('play')
            }
        },
        //上一首
        previous({ commit, dispatch, state, rootState }) {
            clearTimeout(state.player_timer)
            if(rootState.playlist.playlist_list.length <=1) {
                state.player.load()
                commit('play')
                return
            }
            const length = rootState.playlist.playlist_list.length
            const pattern = state.play_pattern
            if(pattern === "List Loop") {
                let index = state.play_previous_index
                if(index === 0) {
                    index = length - 1
                }else {
                    index -= 1
                }
                commit('setPlayPreviousIndex', index)
                dispatch('play')
            }else if(pattern === "Singles Loop") {
                dispatch('play')
            }else if(pattern === "Random Play") {
                let index = Math.floor(Math.random()*(length))
                while(index === state.play_previous_index) {
                    index = Math.floor(Math.random()*(length))   
                }
                commit('setPlayPreviousIndex', index)
                dispatch('play')
            }
        },
        //设置播放模式
        setPlayPattern({ commit }, pattern) {
            if(pattern === "List Loop" || pattern === "Singles Loop" || pattern === "Random Play") {
                commit('setPlayPattern', pattern)
            }
        }
    },

    getters: {
        player: state => {
            return state.player
        }
    }
}