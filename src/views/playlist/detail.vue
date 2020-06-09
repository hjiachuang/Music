<template>
    <div class="playlist-detail" v-loading.fullscreen.lock="loading">
        <div class="playlist-detail-container">
            <div class="playlist-detail-bgp">
                <v-img :src="playlistDetail.logo"></v-img>
                <div class="playlist-detail-bgp-mask"></div>
            </div>
            <v-card style="background-color: transparent" class="elevation-0">
                <v-container>
                    <v-row class="px-0">
                        <v-col cols="6">
                            <v-img style="border-radius: 1rem" :src="playlistDetail.logo"></v-img>
                        </v-col>
                        <v-col cols="6">
                            <v-row class="flex-column justify-space-between" style="height: 100%;">
                                <v-col cols="auto">
                                    <h3 class="title font-weight-black">{{playlistDetail.dissname}}</h3>
                                </v-col>
                                <v-col cols="auto">
                                    <v-avatar width="2rem" height="2rem" min-height="2rem">
                                        <img :src="playlistDetail.headurl" :alt="playlistDetail.nickname">
                                    </v-avatar>
                                    <span class="body-1 ml-2 white--text">{{playlistDetail.nickname}}</span>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                    <v-row class="px-0" style="line-height: 20px;" @click="descriptionShow = true">
                        <v-col cols="10" class="pr-0">
                            <p class="subtitle-2 white--text ma-0 pa-0" style="height: 20px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap" v-html="`简介: ${description(playlistDetail.desc)}`"></p>
                        </v-col>
                        <v-col cols="2" class="text-right">
                            <v-icon class="white--text">mdi-chevron-down</v-icon>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>
            <song-list style="margin-top: -1rem;" :playlist="playlistDetail.songlist" :playlist_id="playlistDetail.disstid"></song-list>
            <div class="player-placeholder" v-if="$store.state.player.play_id !== ''"></div>
            <description :detail="playlistDetail" v-show="descriptionShow" @show="descriptionShow = false" />
        </div>
    </div>
</template>

<script>
    import SongList from '../../components/SongList'
    import Description from '../../components/Description'
    import '../../assets/css/animation.css'
    export default {
        name: "playlist-detail",
        components: { SongList, Description },
        data: () => ({
            playlistId: "",
            playlistName: "",
            playlistDetail: {
                logo: "",
                desc: "",
                songlist: [],
                disstid: "",
            },
            descriptionShow: false,
            loading: false
        }),
        created() {
            this.playlistId = this.$route.params.id
            this.playlistName = this.$route.query.name
            this.loading = true
            try {
                this._getPlaylistDetail()
            }catch(err) {
                console.log(err)
            }
        },
        methods: {
            async _getPlaylistDetail() {
                try{
                    const data = await this.$axios.get(`/api/getSongListDetail?disstid=${this.playlistId}`)
                    if(data.status === 200) {
                        this.playlistDetail = data.data.response.cdlist[0]
                        this.loading = false
                    }else {
                        console.log("网络错误")
                    }
                }catch(err) {
                    console.log(err)
                }
            },
            description(str) {
                const re = /<br>/g
                return str.replace(re, " ")
            }
        }
    }
</script>

<style lang="scss" scoped>
.playlist-detail {
    position: fixed;
    top: 56px;
    left: 0;
    width: 100%;
    height: calc(100vh - 56px);
    overflow: hidden;
    .playlist-detail-container {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: auto;
        .playlist-detail-bgp {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            filter: blur(10px);
            background-color: rgba(18,23,24,.1);
            .playlist-detail-bgp-mask {
                position: absolute;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(18,23,24,.1);
            }
        }
        .playlist-detail-cover {
            position: relative;
            width: 12rem;
            height: 12rem;
            /*left: 50%;*/
            margin-left: 1rem;
            margin-top: 1rem;
            margin-bottom: 1.5rem;
            border-radius: 2rem;
            box-shadow: 0 7px 13px rgba(0,0,0,.35);
            .playlist-detail-cover-img {
                width: 100%;
                height: 100%;
                border-radius: 1rem;
                overflow: hidden;
            }
        }
        .title {
            position: relative;
            color: #fff;
        }
        .player-placeholder {
            width: 100%;
            height: 75px;
        }
    }
}
</style>