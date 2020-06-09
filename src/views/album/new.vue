<template>
    <div class="album-new" v-loading.fullscreen="loading">
        <div class="album-new-container">
            <v-slide-group mandatory show-arrows>
                <v-slide-item v-for="item in new_album_tag" :key="item.id" v-slot:default="{ active, toggle }">
                    <v-btn class="mx-2" :input-value="active" active-class="green accent-4 white--text" depressed rounded @click="toggle();getNewAlbum(item.id)">
                        {{item.name}}
                    </v-btn>
                </v-slide-item>
            </v-slide-group>
            <v-container>
                <v-row v-infinite-scroll="load" infinite-scroll-disabled="disabled" infinite-scroll-distance="0">
                    <v-col cols="4" class="pa-2" v-for="(item, index) in new_album" :key="index" @click="toDetail(item.mid, item.name)">
                        <v-card>
                            <v-lazy>
                                <v-img :src="`https://y.qq.com/music/photo_new/T002R300x300M000${item.mid}_1.jpg?max_age=2592000`"></v-img>
                            </v-lazy>
                            <div class="mt-2 px-1">
                                <rolling-subtitles :text="item.name" :fontSize="'12px'" :fontWeight="800"></rolling-subtitles>
                                <rolling-subtitles :text="item.singers | singer" :fontSize="'12px'"></rolling-subtitles>
                                <p class="ma-0" style="font-size: 10px;">{{item.release_time}}</p>
                            </div>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </div>
    </div>
</template>

<script>
    import RollingSubtitles from '../../components/RollingSubtitles'
    export default {
        name: "album-new",
        components: { RollingSubtitles },
        data: () => ({
            new_album_tag: [],
            new_album: [],
            new_album_total: 0,
            area: 1,
            page: 1,
            limit: 30,
            loading: false
        }),
        computed: {
            noMore() {
                return this.new_album.length >= this.new_album_total
            },
            disabled() {
                return this.loading || this.noMore
            }
        },
        filters: {
            singer(arr) {
                if(arr.length === 1) {
                    return arr[0].name
                }else {
                    return arr.map(v => v.name).join(' / ')
                }
            }
        },
        created() {
            this.loading = true
            try{
                this._getNewAlbumTag()
                this._getNewAlbum()
            }catch(err) {
                console.log(err)
            }
            setTimeout(() => {
                this.loading = false
            }, 500)
        },
        methods: {
            async _getNewAlbumTag() {
                try{
                    const data = await this.$axios.get('/api/getNewDisks?getTag=true')
                    if(data.status === 200) {
                        if(data.data.response.code === 0 && data.data.response.new_album_tag.code === 0) {
                            this.new_album_tag = data.data.response.new_album_tag.data.area
                        }else {
                            console.log("获取新碟分类列表失败")
                        }
                    }else {
                        console.log("网络错误")
                    }
                }catch(err) {
                    console.log(err)
                }
            },
            async _getNewAlbum(area=1) {
                try{
                    const data = await this.$axios.get(`/api/getNewDisks?area=${area}&page=${this.page}`)
                    if(data.status === 200) {
                        if(data.data.response.code === 0 && data.data.response.new_album.code === 0) {
                            this.new_album_total = data.data.response.new_album.data.total
                            this.new_album.push( ...data.data.response.new_album.data.albums )
                        }else {
                            console.log("获取新碟列表失败")
                        }
                    }else {
                        console.log("网络错误")
                    }
                }catch(err) {
                    console.log(err)
                }
            },
            getNewAlbum(id) {
                if(id !== this.area) {
                    this.loading = true
                    this.area = id
                    this.new_album_total = 0
                    this.new_album = []
                    this.page = 1
                    this._getNewAlbum(id)
                    setTimeout(() => {
                        this.loading = false
                    }, 500)
                }
            },
            load() {
                this.loading = true
                this.page += 1
                this._getNewAlbum(this.area)
                setTimeout(() => {
                    this.loading = false
                }, 500)
            },
            toDetail(id, name) {
                this.$router.push(`/album/detail/${id}?name=${name}`)
            }
        }
    }
</script>

<style lang="scss" scoped>
.album-new {
    position: fixed;
    top: 56px;
    left: 0;
    right: 0;
    height: calc(100vh - 56px);
    overflow: hidden;
    .album-new-container {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: auto;
    }
}
</style>