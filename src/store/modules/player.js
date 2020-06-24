const albumImgUrl = (id) => {
    return `https://y.gtimg.cn/music/photo_new/T002R300x300M000${id}.jpg?max_age=2592000`
}

export default {
    namespaced: true,

    //模块State
    state: {
        player: null,               //播放器
        player_timer: null,         //播放器定时器
        playing: false,             //是否播放中
        play_id: "",                //播放歌曲id
        play_name: "",              //播放歌曲名
        play_artists: [],          //播放歌曲歌手数组
        play_album: "",             //播放歌曲专辑名
        play_link: "",              //播放歌曲链接
        play_img: "",               //播放歌曲专辑封面
        play_pattern: "List Loop",  //播放模式  "Singles Loop": 单曲循环; "List Loop": 列表循环; "Random Play": 随机播放;
        play_previous_index: 0      //上一个播放编号
    },

    actions: {

        /*
        * 主入口，添加播放任务
        * options参数： {
        *   type: "empty" or "add"  传递过来的歌曲列表是要替换当前播放列表还是添加进播放列表
        *   index: Number           在这个歌曲列表想播放的那首歌的位置
        *   lists_id: String        传递过来的歌曲列表的唯一ID
        *   lists: Array            传递过来的歌曲列表
        * }
        * */
        index({ state, rootState, dispatch, commit }, {type, index=0, lists_id=null, lists=[]}) {
            if(type === "empty") {      //传递过来的是替换播放列表模式的
                //如果当前播放列表的id和传递过来的id是一样的话，直接设置当前播放歌曲的位置然后播放
                if(lists_id === rootState.playlist.playlist_id) {
                    if(lists[index].id === state.play_id) {
                        dispatch('play')
                    }else {
                        commit('setPlayPreviousIndex', parseInt(index))
                        dispatch('play')
                    }
                }else { //播放列表id不一致，直接替换播放列表内容
                    commit("playlist/setPlayLists",{
                        lists :lists,
                        id: lists_id
                    },{root: true})
                    commit('setPlayPreviousIndex', parseInt(index))
                    dispatch('play')
                }
            }else if(type === "add") {      //传递过来的是添加歌曲模式的
                const tempLists = JSON.parse(JSON.stringify(rootState.playlist.playlist_list))
                if(tempLists.length === 0) {    //如果当前播放列表为空，直接添加播放
                    tempLists.push(lists[index])
                    commit('playlist/setPlayLists', {
                        lists: tempLists,
                        id: "custom/" + new Date().getTime()
                    }, {root: true})
                    commit('setPlayPreviousIndex', 0)
                    dispatch('play')
                }else {                         //如果播放列表不为空，先搜索列表中是否包含这首歌，是的话直接播放
                    for(let i in tempLists) {
                        if(tempLists[i].id === lists[index].id){
                            if(state.play_previous_index !== i) {
                                commit('setPlayPreviousIndex', i)
                            }
                            dispatch('play')
                            return
                        }
                    }                           //列表不包含这首歌，直接添加
                    const tempIndex = state.play_previous_index + 1
                    tempLists.splice(tempIndex,0,lists[index])
                    commit('playlist/setPlayLists', {
                        lists: tempLists,
                        id: rootState.playlist.playlist_id.indexOf("custom") !== -1? rootState.playlist.playlist_id: `custom/${rootState.playlist.playlist_id}`
                    }, {root: true})
                    commit('setPlayPreviousIndex', parseInt(tempIndex))
                    dispatch('play')
                }
            }
        },
        async play({ dispatch, commit, state, rootState }) {
            if(rootState.playlist.playlist_list[state.play_previous_index].canPlay) {
                const name = rootState.playlist.playlist_list[state.play_previous_index].name
                const album = rootState.playlist.playlist_list[state.play_previous_index].albumName
                const artists = rootState.playlist.playlist_list[state.play_previous_index].artists.reduce((sum, v, i, arr) => {
                    sum += v.name
                    if(i !== arr.length - 1) {
                        sum += "&"
                    }
                    return sum
                }, "")
                const link_data = await axios.get(`/getUrl?name=${encodeURIComponent(name)}&album=${encodeURIComponent(album)}&artists=${encodeURIComponent(artists)}&rawData=true`)
                if(link_data.status === 200) {
                    if(link_data.data.code === 0) {
                        const link = link_data.data.result.url
                        if(link === null) {
                            console.log("无法播放自动下一首1")
                            commit("playlist/canPlay", state.play_previous_index, {root: true})
                            dispatch('next')
                            return
                        }
                        commit('setPlayMessage',{
                            id: rootState.playlist.playlist_list[state.play_previous_index].id,
                            name: rootState.playlist.playlist_list[state.play_previous_index].name,
                            artists: rootState.playlist.playlist_list[state.play_previous_index].artists,
                            album: rootState.playlist.playlist_list[state.play_previous_index].albumName,
                            link: link,
                            img: albumImgUrl(rootState.playlist.playlist_list[state.play_previous_index].albumId)
                        })
                        commit('play')
                    }else {
                        console.log("无法播放自动下一首2")
                        commit("playlist/canPlay", state.play_previous_index, {root: true})
                        dispatch('next')
                    }
                }else {
                    console.log("网络错误自动下一首3")
                    commit("playlist/canPlay", state.play_previous_index, {root: true})
                    dispatch('next')
                }
            }else {
                console.log("无法播放自动下一首4")
                dispatch('next')
            }
        },
        //设置播放定时器
        setTimer({ commit, dispatch, state }) {
            clearTimeout(state.player_timer)
            state.player.oncanplay = () => {
                clearTimeout(state.player_timer)
                const duration = state.player.duration
                const currentTime = state.player.currentTime
                const timer = setTimeout(() => {
                    dispatch('next')
                }, (duration - currentTime + 1) * 1000)
                commit('setTimer',timer)
            }

        },
        //下一首
        next({ commit, dispatch, state, rootState }) {
            clearTimeout(state.player_timer)
            const allCanPlay = rootState.playlist.playlist_list.reduce((sum, v) => {
                if(v.hasOwnProperty("canPlay") && !v.canPlay) {
                    return sum + 1
                }else {
                    return sum + 0
                }
            },0)
            if(allCanPlay === rootState.playlist.playlist_list.length) {
                console.log("当前播放列表没有可以播放的歌曲")
            }else {
                if(rootState.playlist.playlist_list.length < 1) {
                    commit("clearPlayer")
                }else if(rootState.playlist.playlist_list.length === 1) {
                    state.player.load()
                    commit('play')
                }else {
                    const length = rootState.playlist.playlist_list.length
                    const pattern = state.play_pattern
                    if (pattern === "List Loop") {
                        let index = state.play_previous_index
                        if (index < length - 1) {
                            index += 1
                        } else {
                            index = 0
                        }
                        commit('setPlayPreviousIndex', index)
                        dispatch('play')
                    } else if (pattern === "Singles Loop") {
                        dispatch('play')
                    } else if (pattern === "Random Play") {
                        let index = Math.floor(Math.random() * (length))
                        while (index === state.play_previous_index) {
                            index = Math.floor(Math.random() * (length))
                        }
                        commit('setPlayPreviousIndex', index)
                        dispatch('play')
                    }
                }
            }
        },
        //上一首
        previous({ commit, dispatch, state, rootState }) {
            clearTimeout(state.player_timer)
            const allCanPlay = rootState.playlist.playlist_list.reduce((sum, v) => {
                if(v.hasOwnProperty("canPlay") && !v.canPlay) {
                    return sum + 1
                }else {
                    return sum + 0
                }
            },0)
            if(allCanPlay === rootState.playlist.playlist_list.length) {
                console.log("当前播放列表没有可以播放的歌曲")
            }else {
                if (rootState.playlist.playlist_list.length <= 1) {
                    state.player.load()
                    commit('play')
                    return
                }
                const length = rootState.playlist.playlist_list.length
                const pattern = state.play_pattern
                if (pattern === "List Loop") {
                    let index = state.play_previous_index
                    if (index === 0) {
                        index = length - 1
                    } else {
                        index -= 1
                    }
                    commit('setPlayPreviousIndex', index)
                    dispatch('play')
                } else if (pattern === "Singles Loop") {
                    dispatch('play')
                } else if (pattern === "Random Play") {
                    let index = Math.floor(Math.random() * (length))
                    while (index === state.play_previous_index) {
                        index = Math.floor(Math.random() * (length))
                    }
                    commit('setPlayPreviousIndex', index)
                    dispatch('play')
                }
            }
        }
    },

    mutations: {
        //给vuex添加一个audio对象
        setPlayer(state) {
            let player = new Audio()
            player.preload = "auto"
            state.player = player
        },
        //设置当前歌曲在播放列表的位置
        setPlayPreviousIndex(state, index) {
            if(Object.prototype.toString.call(index) === "[object Number]"){
                state.play_previous_index = index
            }else if(Object.prototype.toString.call(parseInt(index)) === "[object Number]") {
                state.play_previous_index = parseInt(index)
            }
        },
        //设置当前播放模式
        setPlayPattern(state, pattern) {
            if(pattern === "List Loop" || pattern === "Singles Loop" || pattern === "Random Play") {
                state.play_pattern = pattern
            }
        },
        //设置当前播放状态
        setPlaying(state, playing) {
            state.playing = playing
        },
        //设置当前播放歌曲信息
        setPlayMessage(state, { id, name, artists, album, link, img}) {
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
            if(artists !== undefined) {
                state.play_artists = artists
            }
            if(album !== undefined) {
                state.play_album = album
            }
            if(link !== undefined) {
                if(link === ""){
                    state.play_link = ""
                }else {
                    state.play_link = link
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
            state.play_artists = []
            state.play_album = ""
            state.play_link = ""
            state.play_img = ""
            state.play_previous_index = 0
            state.player.src = ""
            state.player.load()
        }
    }
}