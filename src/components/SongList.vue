<template>
    <div class="songlist">
        <div class="playall" @click="playList(0, $event)">
            <v-icon class="play-icon green--text text--accent-4" v-if="$store.state.playlist.playlist_id === playlist_id && $store.state.player.playing && !$store.state.player.player.ended">mdi-pause-circle</v-icon>
            <v-icon class="play-icon green--text text--accent-4" v-else>mdi-play-circle</v-icon>
            <span>播放全部</span>
            <span class="current-playing grey--text" v-if="playlistId === playlist_id && playId !== null">当前播放: {{index+1}}-{{playName}}</span>
            <transition @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
                <div class="play-ball" v-show="ball">
                    <v-icon class="green--text text--accent-4">mdi-music-circle-outline</v-icon>
                </div>
            </transition>
        </div>
        <div v-for="(item,index) in playlist" :key="index" :class="item.canPlay? (playId === item.id && playlistId === playlist_id? 'songitem green--text text--accent-4':'songitem'):'songitem grey--text'" @click="$router.push(`/song/${item.id}`)">
            <span class="songitem-index">{{index + 1}}</span>
            <div class="songitem-message">
                <span class="songitem-message-name">{{item.name}}</span>
                <span class="songitem-message-info">
                    <v-img class="d-inline-block" style="width: 20px; height: 10px;" src="../assets/images/vip.png" v-if="item.vip === 4"></v-img>
                    <span v-for="(artist, idx) in item.artists" :key="idx">
                      {{artist.name}}
                      <span v-if="idx !== (item.artists && item.artists.length) - 1">/</span>
                    </span>
                    <span v-if="item.albumName">{{" - " + (item.albumName)}}</span>
                </span>
            </div>
            <v-icon class="green--text text--accent-4 play-icon" v-if="item.canPlay && $store.state.player.play_id === item.id && $store.state.player.playing && !$store.state.player.player.ended" @click.stop="playSong(index,item.id,$event)">mdi-pause-circle</v-icon>
            <v-icon class="green--text text--accent-4 play-icon" v-if="item.canPlay &&( $store.state.player.play_id !== item.id || !$store.state.player.playing || $store.state.player.player.ended)" @click.stop="playSong(index,item.id,$event)">mdi-play-circle</v-icon>
        </div>
        <!-- <div class="mask" v-if="$store.state.music.playing && !$store.state.music.player.ended"></div> -->
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    export default {
        name: "SongList",
        data: () => ({
            ball: false,
            ballX: 0,
            ballY: 0
        }),
        computed: {
            ...mapState({
                index: state => state.player.play_previous_index,
                playName: state => state.player.play_name,
                playArtists: state => state.player.play_artists,
                playId: state => state.player.play_id,
                playlistId: state => state.playlist.playlist_id
            })
        },
        props: {
            playlist: {
                type: Array,
                required: true,
                default: () => [],
            },
            playlist_id: {
                type: String,
                required: true,
                default: ""
            }
        },
        methods: {
            playList(index, el) {
                this.ballX = el.pageX
                this.ballY = el.pageY
                if (this.$store.state.playlist.playlist_id !== this.playlist_id) {
                    this.ball = true
                    this.play(index)
                } else {
                    this.play_or_pause()
                }
            },
            playSong(index, id, el) {
                this.ballX = el.pageX
                this.ballY = el.pageY
                if (this.$store.state.player.play_id !== id) {
                    this.ball = true
                    this.play(index)
                } else {
                    this.play_or_pause()
                }
            },
            play(index) {
                this.$store.dispatch("player/index", {
                    lists: this.playlist,
                    lists_id: this.playlist_id,
                    index: index,
                    type: "empty"
                });
            },
            play_or_pause() {
                if (this.$store.state.player.player.paused) {
                    this.ball = true
                    this.$store.commit("player/play")
                } else {
                    this.$store.commit("player/pause");
                }
            },
            beforeEnter(el) {
                el.style.left = this.ballX + 'px'
                el.style.top = this.ballY + 'px'
                el.style.transform = 'translate(0,0)'
                el.children[0].style.transform = 'translate(0,0)'
            },
            enter(el, done) {
                el.offsetWidth
                el.style.transform = 'translate(10px, 0)'
                el.children[0].style.transform = 'translate(0, 500px)'
                done()
            },
            afterEnter() {
                this.ball = !this.ball
            }
        }
    };
</script>

<style lang="scss" scoped>
    .songlist {
        position: relative;
        min-height: 200px;
        background: #fff;
        border-radius: 1rem 1rem 0 0;
        width: 100%;
        overflow: hidden;
        .playall {
            display: flex;
            align-items: center;
            height: 60px;
            font-size: 16px;
            vertical-align: middle;
            cursor: pointer;
            position: relative;
            .play-icon {
                width: 50px;
                font-size: 24px;
                text-align: center;
            }
            span {
                margin: 0;
                padding: 0;
            }
            .current-playing {
                position: absolute;
                top: 42px;
                left: 50px;
                font-size: 12px;
            }
            .play-ball {
                position: fixed;
                z-index: 999999;
                top: 0;
                left: 0;
                font-size: 24px;
                line-height: 24px;
                transition: all 1s linear;
                i {
                    transition: all 1s cubic-bezier(0.8,-0.3,1,0.68);
                }
            }
        }
        .songitem {
            display: flex;
            height: 60px;
            align-items: center;
            .songitem-index {
                flex: none;
                width: 50px;
                height: 100%;
                line-height: 60px;
                text-align: center;
            }
            .songitem-message {
                flex: auto;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                max-width: calc(100vw - 100px);
                height: 100%;
                .songitem-message-name {
                    font-size: 14px;
                    font-weight: bold;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .songitem-message-info {
                    font-size: 12px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
            .play-icon {
                flex: none;
                font-size: 24px;
                width: 50px;
                height: 50px;
                text-align: center;
                cursor: pointer;
            }
        }
        .mask {
            width: 100%;
            height: 60px;
        }
    }
</style>