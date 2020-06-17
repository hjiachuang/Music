<template>
    <div class="album-detail">
        <div class="album-detail-container">
            <div class="album-detail-bgp">
                <v-img :src="`https://y.qq.com/music/photo_new/T002R300x300M000${albumDetail.mid}_1.jpg?max_age=2592000`"></v-img>
                <div class="album-detail-bgp-mask"></div>
            </div>
            <v-card style="background-color: transparent" class="elevation-0">
                <v-container>
                    <v-row class="px-0">
                        <v-col cols="6">
                            <v-img style="border-radius: 1rem" :src="`https://y.qq.com/music/photo_new/T002R300x300M000${albumDetail.mid}_1.jpg?max_age=2592000`"></v-img>
                        </v-col>
                        <v-col cols="6">
                            <v-row class="flex-column " style="height: 100%;">
                                <v-col cols="auto">
                                    <h3 class="title font-weight-black">{{albumDetail.name}}</h3>
                                </v-col>
                                <v-col cols="auto">
                                    <v-avatar width="2rem" height="2rem" min-width="2rem" min-height="2rem">
                                        <img :src="`https://y.gtimg.cn/music/photo_new/T001R300x300M000${albumDetail.singermid}.jpg?max_age=2592000`" :alt="albumDetail.singername">
                                    </v-avatar>
                                    <span class="body-1 ml-2 white--text">{{albumDetail.singername}}</span>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                    <v-row class="px-0" style="line-height: 20px;" @click="descriptionShow = true">
                        <v-col cols="10" class="pr-0">
                            <p class="subtitle-2 white--text ma-0 pa-0" style="height: 20px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap" v-html="`简介: ${description(albumDetail.desc)}`" v-if="albumDetail.hasOwnProperty('desc')"></p>
                        </v-col>
                        <v-col cols="2" class="text-right">
                            <v-icon class="white--text">mdi-chevron-down</v-icon>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>
            <song-list style="margin-top: -1rem" :playlist="albumDetail.list" :playlist_id="albumDetail.mid"></song-list>
            <p class="text-center ma-2 green--text text--accent-4">没有了诶...</p>
            <div class="player-placeholder" v-if="$store.state.player.play_id !== ''"></div>
            <description :detail="albumDetail" v-show="descriptionShow" @show="descriptionShow = false" />
        </div>
    </div>
</template>

<script>
    import SongList from '../../components/SongList'
    import Description from '../../components/Description'
    export default {
        name: "album-detail",
        components: { SongList, Description },
        data: () => ({
            albumDetail: {},
            descriptionShow: false
        }),
        created() {
            this.$store.commit("load/setLoad")
            try{
                this._getAlbum()
                this.$store.dispatch("load/endLoad")
            }catch(err) {
                console.log(err)
            }
        },
        methods: {
            async _getAlbum() {
                const mid = this.$route.params.id
                try{
                    const data = await this.$axios.get(`/api/getAlbumInfo?albummid=${mid}`)
                    if(data.status === 200) {
                        if(data.data.response.code === 0) {
                            this.albumDetail = data.data.response.data
                        }
                    }
                }catch(err) {
                    console.log(err)
                }
            },
            description(str) {
                const re = /\n/g
                return str.replace(re, " ")
            }
        }
    }
</script>

<style lang="scss" scoped>
    .album-detail {
        position: fixed;
        top: 56px;
        left: 0;
        width: 100%;
        height: calc(100vh - 56px);
        overflow: hidden;
        .album-detail-container {
            position: relative;
            width: 100%;
            height: 100%;
            overflow: auto;
            .album-detail-bgp {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                filter: blur(10px);
                background-color: rgba(18,23,24,.1);
                .album-detail-bgp-mask {
                    position: absolute;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(18,23,24,.1);
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