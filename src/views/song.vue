<template>
    <div class="song">
        <div class="song-header">
            <v-app-bar fixed class="elevation-0" color="transparent">
                <v-app-bar-nav-icon @click="$router.go(-1)">
                    <v-icon style="color: white">mdi-chevron-left</v-icon>
                </v-app-bar-nav-icon>
                <v-list max-width="calc(100% - 72px)" color="transparent">
                    <v-list-item two-line v-if="songInfo.hasOwnProperty('track_info')">
                        <v-list-item-content>
                            <v-list-item-title style="color: white">{{playName}}</v-list-item-title>
                            <v-dialog>
                                <template v-slot:activator="{ on, showArtists }">
                                    <v-list-item-subtitle style="color: white" v-bind="showArtists" v-on="on">
                                        <span v-for="(item, index) in playArtists" :key="index">
                                            {{item.name}}
                                            <span v-if="index !== (playArtists.length) - 1">/</span>
                                        </span>
                                        <v-icon dense style="color: white">mdi-chevron-right</v-icon>
                                    </v-list-item-subtitle>
                                </template>
                                <v-card>
                                    <v-card-title>
                                        <span class="headline">请选择要查看的歌手：</span>
                                    </v-card-title>
                                    <v-card-text>
                                        <v-container style="line-height: 1.5;">
                                            <v-row>
                                                <v-col cols="12" class="py-0" v-for="(item, index) in playArtists" :key="index" @click="toSinger(item)">
                                                    <v-row>
                                                        <v-col cols="3" class="pa-1">
                                                            <v-img :src="`http://y.gtimg.cn/music/photo_new/T001R300x300M000${item.id}.jpg`" v-if="item.id"></v-img>
                                                        </v-col>
                                                        <v-col cols="9" class="align-center">
                                                            <p class="body-1 font-weight-black" style="margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap">{{item.name}}</p>
                                                        </v-col>
                                                    </v-row>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                    </v-card-text>
                                </v-card>
                            </v-dialog>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
                <v-spacer></v-spacer>
                <v-app-bar-nav-icon>
                    <v-dialog>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn dark v-bind="attrs" v-on="on" icon><v-icon>mdi-information-outline</v-icon></v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="headline">{{playName}}</span>
                            </v-card-title>
                            <v-card-text>
                                <v-container style="line-height: 1.5;">
                                    <v-row>
                                        <v-col cols="12">
                                            <v-icon>mdi-account-music</v-icon>
                                            <strong class="mx-2">歌手:</strong>
                                            <span v-for="(item, index) in playArtists" :key="index">{{item.name}}
                                                <span v-if="index !== (playArtists.length) - 1">/</span>
                                            </span>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-icon>mdi-album</v-icon>
                                            <strong class="mx-2">专辑:</strong>
                                            <span>{{playAlbum}}</span>
                                        </v-col>
                                        <v-col cols="12" v-for="(item, index) in songInfo.info" :key="index" v-if="songInfo.hasOwnProperty('info')">
                                            <v-icon v-if="index === 'company'">mdi-office-building</v-icon>
                                            <v-icon v-else-if="index === 'lan'">mdi-translate</v-icon>
                                            <v-icon v-else-if="index === 'pub_time'">mdi-folder-plus</v-icon>
                                            <v-icon v-else-if="index === 'genre'">mdi-music-clef-treble</v-icon>
                                            <v-icon v-else-if="index === 'intro'">mdi-clipboard-account</v-icon>
                                            <strong class="mx-2">{{item.title}}:</strong>
                                            <span v-for="value in item.content" :key="value.id">{{value.value}}</span>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>
                        </v-card>
                    </v-dialog>
                </v-app-bar-nav-icon>
            </v-app-bar>
            <!--占坑用-->
            <v-app-bar class="elevation-0"></v-app-bar>
        </div>
        <div class="song-background">
            <v-img width="100%" height="100%" :src="playImg"></v-img>
            <div class="song-background-mask"></div>
        </div>
        <div class="song-play-img" v-show="!showLyric" @click="showLyric = true">
            <v-img  width="100%" height="100%" :src="playImg"></v-img>
            <div class="song-play-progress-ball" :style="`transform: rotate(${progress*3.6}deg)`"></div>
            <el-progress class="song-play-progress-circle" :width="width * 0.6 + 12" :stroke-width="8" type="circle" :percentage="progress" :show-text="false" :color="'#4CAF50'"></el-progress>
        </div>
        <lyric class="song-lyric" :playing="playing" :lyric="lyric" :currentTime="currentTime" v-show="showLyric && lyric.length !== 0" @off="showLyric = false"></lyric>
        <div class="song-control">
            <v-container>
                <v-row class="align-center text-center">
                    <v-col class="song-play-pattern">
                        <i class="icon-repeat" v-if="$store.state.player.play_pattern === 'List Loop'" @click="setPattern"></i>
                        <i class="icon-rotate-cw" v-else-if="$store.state.player.play_pattern === 'Singles Loop'" @click="setPattern"></i>
                        <i class="icon-shuffle" v-else @click="setPattern"></i>
                    </v-col>
                    <v-col class="song-play-prev">
                        <i class="icon-skip-back" @click="previous"></i>
                    </v-col>
                    <v-col class="song-play-play-pause">
                        <i class="icon-pause-circle" v-if="playing && !player.ended" @click="pause"></i>
                        <i class="icon-play-circle" v-else @click="play"></i>
                    </v-col>
                    <v-col class="song-play-next">
                        <i class="icon-skip-forward" @click="next"></i>
                    </v-col>
                    <v-col class="song-play-list">
                        <v-dialog>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn dark v-bind="attrs" v-on="on" icon><i class="icon-list"></i></v-btn>
                            </template>
                            <v-card>
                                <v-card-title>
                                    <span class="headline">播放列表 ({{playlist.length}})</span>
                                    <v-spacer></v-spacer>
                                    <v-btn icon @click="clearPlaylist"><v-icon>mdi-delete</v-icon></v-btn>
                                </v-card-title>
                                <v-card-text>
                                    <v-container style="line-height: 1.5;">
                                        <v-row>
                                            <v-col cols="12" v-for="(item, index) in playlist" :key="index" :class="playId === item.id? 'green--text': (item.canPlay? '':'grey--text')" @click="playThis(index)">
                                                <div class="float-left" style="max-width: calc(100% - 24px); overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
                                                    <strong>{{item.name}}</strong> -
                                                    <span v-for="(artist, index) in item.artists" :key="index">
                                                        {{artist.name}}<span v-if="index !== (item.artists.length) - 1">/</span>
                                                    </span>
                                                </div>
                                                <v-icon class="float-right" @click="$store.dispatch('playlist/deleteSong',item.mid)">mdi-close</v-icon>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-card-text>
                            </v-card>
                        </v-dialog>
                    </v-col>
                </v-row>
            </v-container>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import Lyric from '../components/Lyric'
    export default {
        name: "song",
        components: { Lyric },
        data: () => ({
            songInfo: {},
            song: {},
            lyric: "",
            currentTime: 0,
            width: 0,
            progress: 25,
            showLyric: false,
            timer: null
        }),
        computed: {
            ...mapState({
                playId: state => state.player.play_id,
                player: state => state.player.player,
                playing: state => state.player.playing,
                playName: state => state.player.play_name,
                playArtists: state => state.player.play_artists,
                playAlbum: state => state.player.play_album,
                playImg: state => state.player.play_img,
                playlist: state => state.playlist.playlist_list
            })
        },
        created() {
            this.$store.commit("load/setLoad")
            this.width = window.document.body.offsetWidth
            this._getSongDetail()
            this._getSongLyric()
            this.$store.dispatch("load/endLoad")
        },
        mounted() {
            this.getProgress()
        },
        watch: {
            playId(id) {
                this._getSongDetail(id)
                this._getSongLyric(id)
            }
        },
        methods: {
            async _getSongDetail(mid=null) {
                const id = mid || this.$route.params.id
                try{
                    const data = await this.$axios.get(`/getSongInfo?songmid=${id}`)
                    if(data.status === 200) {
                        if(data.data.response.code === 0 && data.data.response.songinfo.code === 0) {
                            this.songInfo = data.data.response.songinfo.data
                            const songTemp = data.data.response.songinfo.data.track_info
                            this.song = {
                                name: songTemp.name || null,
                                id: songTemp.mid || null,
                                albumId: songTemp.album.pmid || null,
                                albumName: songTemp.album.name || null,
                                mvId: songTemp.mv.vid || null,
                                mvName: songTemp.mv.name || null,
                                artists: songTemp.singer.map(sing => {return {id: sing.mid, name: sing.name}}) || [],
                                vip: songTemp.sa,
                                createTime: songTemp.time_public || "1990-01-01",
                                canPlay: true
                            }
                            this.play()
                        }else {
                            console.error("获取歌曲详情失败, code:", data.data.response.code)
                            this.$message.error("获取歌曲详情失败")
                        }
                    }else {
                        console.error("网络错误, code:", data.status)
                        this.$message.error("网络错误")
                    }
                }catch(err) {
                    console.error(err)
                    this.$message.error("请求失败")
                }
            },
            async _getSongLyric(mid=null) {
                const id = mid || this.$route.params.id
                try{
                    const data = await this.$axios.get(`/getLyric?songmid=${id}`)
                    if(data.status === 200) {
                        if(data.data.response.code === 0) {
                            this.lyric = data.data.response.lyric
                        }else {
                            console.error("获取歌曲歌词失败, code:", data.data.response.code)
                            this.$message.error("获取歌曲歌词失败")
                        }
                    }else {
                        console.error("网络错误, code:", data.status)
                        this.$message.error("网络错误")
                    }
                }catch(err) {
                    console.error(err)
                    this.$message.error("请求失败")
                }
            },
            toSinger(singer) {
                this.$router.push(`/artist/detail/${singer.id}?name=${singer.name}`)
            },
            getProgress() {
                clearInterval(this.timer)
                this.timer = setInterval(()=>{
                    const player = this.player
                    const currentTime = player.currentTime || 0
                    const duration = player.duration || 100
                    this.currentTime = currentTime
                    this.progress = currentTime/duration * 100
                }, 100)
            },
            previous() {
                this.$store.dispatch("player/previous")
            },
            next() {
                this.$store.dispatch("player/next")
            },
            play() {
                if (this.$store.state.player.play_id !== this.song.id) {
                    this.$store.dispatch("player/index", {
                        lists: [ this.song ],
                        index: 0,
                        type: "add"
                    });
                } else {
                    if (this.$store.state.player.player.paused) {
                        this.$store.commit("player/play")
                    }
                }
                this.getProgress()
            },
            pause() {
                this.$store.commit("player/pause");
                clearInterval(this.timer)
            },
            setPattern() {
                if(this.$store.state.player.play_pattern === "List Loop") {
                    this.$store.commit("player/setPlayPattern", "Random Play")
                }else if(this.$store.state.player.play_pattern === "Random Play") {
                    this.$store.commit("player/setPlayPattern", "Singles Loop")
                }else {
                    this.$store.commit("player/setPlayPattern", "List Loop")
                }
            },
            clearPlaylist() {
                this.$messageBox.confirm('确定要清空播放列表?', '提示', {
                    confirmButtonText: '清空',
                    cancelButtonText: '取消',
                    type: 'warning',
                    customClass: "mes-box",
                }).then(() => {
                    this.$store.dispatch("playlist/clearPlaylist")
                    this.$router.push("/recommend")
                    this.$message.success("已清空播放列表")
                    // this.$router
                }).catch(() => {
                    this.$message.info("已取消删除")
                });
            },
            playThis(index) {
                this.$store.dispatch("player/index", {
                    lists: this.playlist,
                    lists_id: this.$store.state.playlist.playlist_id,
                    index: index,
                    type: "empty"
                })
            }
        },
        beforeDestroy() {
            clearTimeout(this.timer)
        }
    }
</script>

<style lang="scss">
.song {
    .song-header {
        height: 56px;
        overflow: hidden;
    }
    .song-background {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        .v-image {
            filter: blur(100px);
        }
        .song-background-mask {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
        }
    }
    .song-play-img {
        position: fixed;
        top: 25%;
        left: 50%;
        width: 60vw;
        height: 60vw;
        margin-left: -30%;
        border-radius: 50%;
        /*overflow: hidden;*/
        padding: 5%;
        background-color: #ffffff;
        .v-image {
            border-radius: 50%;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
        }
        .song-play-progress-ball {
            position: absolute;
            width: 16px;
            height: 16px;
            background-color: #4CAF50;
            top: -8px;
            left: 50%;
            margin-left: -8px;
            border-radius: 50%;
            transform-origin: 8px calc(8px + 30vw);
            &::before {
                content: "";
                position: absolute;
                width: 6px;
                height: 6px;
                background-color: #fff;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                border-radius: 50%;
            }
        }
        .song-play-progress-circle {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: calc(60vw + 12px);
            height: calc(60vw + 12px);
            z-index: -1;
        }
    }
    .song-lyric {
        max-height: calc(100vh - 151px);
    }
    .song-control {
        position: fixed;
        z-index: 1;
        left: 0;
        right: 0;
        bottom: 0;
        i {
            color: white;
            font-size: 1.8rem;
        }
        .song-play-play-pause {
            i {
                font-size: 2.8rem;
            }
        }
    }
}
.mes-box {
    position: fixed;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    a {
        display: block;
        font-size: 16px;
        font-weight: bold;
        margin: 6px 4px;
        padding: 0;
        height: 40px;
        line-height: 40px;
        text-decoration: none;
        color: #000;
    }
}
</style>