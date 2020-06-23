<template>
    <div class="playlist-index" style="height: 100vh; overflow: auto;">
        <v-container class="py-0">
            <v-row>
                <v-col class="d-flex justify-space-between align-center">
                    <v-menu v-model="showMenu" :close-on-content-click="false" :nudge-width="200" offset-y>
                        <template v-slot:activator="{ on }">
                            <v-btn color="green accent-4" dark v-on="on">
                                {{categoryId === 10000000? "全部歌单":categoryName}}
                            </v-btn>
                        </template>
                        <v-card class="mx-auto">
                            <v-list>
                                <v-list-group color="green accent-4" v-for="(item, index) in category" :key="index" v-model="item.active" no-action>
                                    <template v-slot:activator>
                                        <v-list-item-content class="pl-4">
                                            <v-list-item-title>{{item.categoryGroupName}}</v-list-item-title>
                                        </v-list-item-content>
                                    </template>
                                    <v-list-item class="pl-10" v-for="(category, i) in item.items" :key="i" :input-value="categoryId === category.categoryId" link @click="changePlaylist(category)">
                                        <v-list-item-title v-html="category.categoryName"></v-list-item-title>
                                    </v-list-item>
                                </v-list-group>
                            </v-list>
                        </v-card>
                    </v-menu>
                    <v-btn-toggle borderless tile dense color="green accent-4" v-model="sortId">
                        <v-btn value="5">
                            推荐
                        </v-btn>
                        <v-btn value="2">
                            最新
                        </v-btn>
                    </v-btn-toggle>
                </v-col>
            </v-row>
            <v-row v-infinite-scroll="load" infinite-scroll-disabled="disabled" infinite-scroll-distance="0">
                <v-col cols="4" class="px-2 py-1" style="min-height: 100px" v-for="(item, index) in (sortId === '5'? playlists.recommend.list : playlists.newest.list)" :key="index" @click="toDetail(item)">
                    <v-lazy :options="{threshold: .5}" transition="fade-transition">
                        <v-card class="mx-auto text-center" :elevation="0">
                            <v-lazy>
                                <v-img class="mx-auto" style="border-radius: 6px" width="100%" height="100%" :src="item.imgurl"/>
                            </v-lazy>
                            <v-card-text class="pa-0 text--primary">
                                <rolling-subtitles :text="item.dissname" fontSize="0.875rem" class="mt-1"/>
                            </v-card-text>
                        </v-card>
                    </v-lazy>
                </v-col>
            </v-row>
            <p class="text-center ma-2 green--text text--accent-4" v-if="this.$store.state.load.loading">Loading...</p>
            <p class="text-center ma-2 green--text text--accent-4" v-if="noMore">没有了诶...</p>
        </v-container>
    </div>
</template>

<script>
    import RollingSubtitles from '../../components/RollingSubtitles'
    export default {
        name: "playlist-index",
        components: { RollingSubtitles },
        data: () => ({
            showMenu: false,
            category: [],
            sortId: "5",
            categoryId: 10000000,
            categoryName: "全部",
            start: 0,
            end: 29,
            playlists: {
                "recommend": {
                    sum: 0,
                    list: []
                },
                "newest": {
                    sum: 0,
                    list: []
                }
            },
        }),
        computed: {
            noMore() {
                if(this.sortId === "5") {
                    return this.playlists.recommend.list.length >= this.playlists.recommend.sum
                }else {
                    return this.playlists.newest.list.length >= this.playlists.newest.sum
                }
            },
            disabled() {
                return this.$store.state.load.loading || this.noMore
            }
        },
        watch: {
            sortId() {
                this.start = 0
                this.end = 29
                this._getPlaylists()
            }
        },
        methods: {
            init() {
                this.$store.commit("load/setLoad")
                try{
                    this._getPlaylistsCategory()
                    this._getPlaylists()
                    this.$store.dispatch("load/endLoad")
                }catch(err) {
                    console.log(err)
                }
            },
            async _getPlaylistsCategory() {
                const data = await this.$axios.get("/api/getSongListCategories")
                if(data.status === 200) {
                    if(data.data.response.code === 0) {
                        this.category = data.data.response.data.categories
                    }else {
                        console.log("获取歌单分类失败")
                    }
                }else {
                    console.log("网络错误")
                }
            },
            async _getPlaylists() {
                try{
                    const data = await this.$axios.get("/api/getSongLists",{
                        params: {
                            categoryId: this.categoryId,
                            page: this.start,
                            limit: this.end,
                            sortId: this.sortId
                        }
                    })
                    if(data.status === 200) {
                        if(data.data.response.code === 0) {
                            const result = data.data.response.data
                            if(this.sortId === "5") {
                                this.playlists.recommend.sum = result.sum
                                this.playlists.recommend.list.push(...result.list)
                            }else {
                                this.playlists.newest.sum = result.sum
                                this.playlists.newest.list.push(...result.list)
                            }
                            this.$store.dispatch("load/endLoad")
                        }else {
                            console.log("歌单列表获取失败")
                        }
                    }else {
                        console.log("网络错误")
                    }
                }catch(err) {
                    console.log(err)
                }
            },
            changePlaylist(category) {
                this.showMenu = false
                this.sortId = "5"
                this.categoryId = category.categoryId
                this.categoryName = category.categoryName
                this.start = 0
                this.end = 29
                this.playlists = {
                    "recommend": {
                        sum: 0,
                        list: []
                    },
                    "newest": {
                        sum: 0,
                        list: []
                    }
                }
                this.$store.commit("load/setLoad")
                this._getPlaylists()
            },
            load() {
                this.$store.commit("load/setLoad")
                this.start += 30
                this.end += 30
                this._getPlaylists()
                this.$store.dispatch("load/endLoad")
            },
            toDetail(playlist) {
                this.$router.push(`/playlist/detail/${playlist.dissid}?name=${encodeURIComponent(playlist.dissname)}`)
            }
        },
        beforeRouteLeave(to, from, next) {
            if(to.name === "Playlist-Detail") {
                const data = {
                    showMenu: this.showMenu,
                    category: this.category,
                    sortId: this.sortId,
                    categoryId: this.categoryId,
                    categoryName: this.categoryName,
                    start: this.start,
                    end: this.end,
                    playlists: this.playlists,
                    loading: this.loading
                }
                window.sessionStorage.setItem("playlists",JSON.stringify(data))
            }else if(to.name === "Recommend") {
                window.sessionStorage.removeItem("playlists")
            }
            next()
        },
        beforeRouteEnter(to, from, next) {
            if(from.name === "Playlist-Detail") {
                let data = window.sessionStorage.getItem("playlists")
                if(data) {
                    data = JSON.parse(data)
                    next(vm => {
                        vm.showMenu = data.showMenu
                        vm.category = data.category
                        vm.sortId = data.sortId
                        vm.categoryId = data.categoryId
                        vm.categoryName = data.categoryName
                        vm.start = data.start
                        vm.end = data.end
                        vm.playlists = data.playlists
                        vm.loading = data.loading
                    })
                }else {
                    next(vm => {
                        vm.init()
                    })
                }
            }else {
                next(vm => {
                    vm.init()
                })
            }
        }
    }
</script>

<style scoped>

</style>