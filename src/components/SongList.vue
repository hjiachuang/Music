<template>
    <div class="songlist">
        <div class="playall" @click="playList(0)">
            <v-icon class="green--text text--accent-4" v-if="$store.state.playlist.playlist_id === playlist_id && $store.state.player.playing && !$store.state.player.player.ended">mdi-pause-circle</v-icon>
            <v-icon class="green--text text--accent-4" v-else>mdi-play-circle</v-icon>
            <span>播放全部</span>
        </div>
        <div v-for="(item,index) in playlist" :key="index" class="songitem" @click="$router.push(`/song/${item.mid}`)">
            <span class="songitem-index">{{index + 1}}</span>
            <div class="songitem-message">
                <span class="songitem-message-name">{{item.name || item.songname}}</span>
                <span class="songitem-message-info">
                    <v-img class="d-inline-block" style="width: 20px; height: 10px;" src="../assets/images/vip.png" v-if="item.sa === 4"></v-img>
                    <span v-for="(article, idx) in item.singer" :key="idx">
                      {{article.name}}
                      <span v-if="idx !== (item.singer && item.singer.length) - 1">/</span>
                    </span>
                    {{" - " + (item.album && item.album.name || item.albumname)}}
                </span>
            </div>
            <v-icon class="green--text text--accent-4 play-icon" v-if="$store.state.player.play_id === item.mid && $store.state.player.playing && !$store.state.player.player.ended" @click.stop="playSong(index,item.mid)">mdi-pause-circle</v-icon>
            <v-icon class="green--text text--accent-4 play-icon" v-else @click.stop="playSong(index,item.mid)">mdi-play-circle</v-icon>
        </div>
        <!-- <div class="mask" v-if="$store.state.music.playing && !$store.state.music.player.ended"></div> -->
    </div>
</template>

<script>
    export default {
        name: "SongList",
        data: () => ({

        }),
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
            playList(index) {
                if (this.$store.state.playlist.playlist_id !== this.playlist_id) {
                    this.play(index)
                } else {
                    this.play_or_pause()
                }
            },
            playSong(index, id) {
                if (this.$store.state.player.play_id !== id) {
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
                    this.$store.commit("player/play")
                } else {
                    this.$store.commit("player/pause");
                }
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
            i {
                width: 50px;
                font-size: 24px;
                text-align: center;
            }
            span {
                margin: 0;
                padding: 0;
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