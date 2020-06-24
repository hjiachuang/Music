<template>
    <div class="search" style="height: calc(100vh - 56px); overflow: auto;">
        <v-container>
            <v-text-field outlined clearable color="pink" label="搜索" append-icon="mdi-magnify"
                          prepend-inner-icon="mdi-music" :error="searchError" v-model="searchWord"
                          :success-messages="searchMsg" @click:append="search"
                          @click:clear="searchResult = {}; searchResultSong = []; searchPage = 1"
                          @keyup.enter="search"></v-text-field>
            <div class="search-history" v-if="searchHistory.length !== 0 && !searchResult.hasOwnProperty('song')">
                <h4>历史搜索</h4>
                <v-row class="px-2">
                    <v-col cols="auto px-1 py-0" v-for="(item, index) in searchHistory" :key="index">
                        <v-chip class="my-1" @click="searchWord = item; search()">
                            {{item}}
                        </v-chip>
                    </v-col>
                </v-row>
            </div>
            <div class="search-suggest mt-2" v-if="!searchResult.hasOwnProperty('song')">
                <h4>热门搜索</h4>
                <v-row class="px-2">
                    <v-col cols="auto px-1 py-0" v-for="(item, index) in searchSuggest" :key="index">
                        <v-chip class="my-1" @click="searchWord = item.k; search()">
                            {{item.k}}
                        </v-chip>
                    </v-col>
                </v-row>
            </div>
            <div class="search-result mt-2" v-if="searchResult.hasOwnProperty('song') && searchResultSong.length !== 0">
                <h4>搜索结果</h4>
                <!--搜索结果中匹配到有歌手信息的显示块-->
                <v-card class="ma-1 px-3" v-if="searchResult.hasOwnProperty('zhida') && searchResult.zhida.type === 1" @click="$router.push(`/artist/detail/${searchResult.zhida['zhida_singer'].singerMID}?name=${searchResult.zhida['zhida_singer'].singerName}`)">
                    <v-row>
                        <v-col cols="4">
                            <v-img style="border-radius: 50%;" width="100%"
                                   :src="searchResult.zhida['zhida_singer'].singerPic"></v-img>
                        </v-col>
                        <v-col cols="auto">
                            <v-row style="height: 100%;" class="flex-column justify-center">
                                <v-col class="py-0 font-weight-black">歌手:
                                    {{searchResult.zhida['zhida_singer'].singerName}}
                                </v-col>
                                <v-col class="py-1 subtitle-2 font-weight-light">
                                    歌曲: {{searchResult.zhida['zhida_singer'].songNum}}
                                    专辑: {{searchResult.zhida['zhida_singer'].albumNum}}
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-card>
                <!--搜索结果中匹配到有专辑信息的显示块-->
                <v-card class="ma-1 px-3" v-if="searchResult.hasOwnProperty('zhida') && searchResult.zhida.type === 3">
                    <v-row>
                        <v-col cols="4">
                            <v-img style="border-radius: 50%;" width="100%"
                                   :src="`https://y.gtimg.cn/music/photo_new/T002R68x68M000${searchResult.zhida.albummid}.jpg?max_age=2592000`"></v-img>
                        </v-col>
                        <v-col cols="auto">
                            <v-row style="height: 100%;" class="flex-column justify-center">
                                <v-col class="py-0 font-weight-black">
                                    {{searchResult.zhida.albumname}}
                                </v-col>
                                <v-col class="py-1 subtitle-2 font-weight-light">
                                    {{searchResult.zhida.singername}}
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-card>
                <ul class="pa-0" v-infinite-scroll="load" infinite-scroll-disabled="disabled"
                    infinite-scroll-distance="0" v-if="searchResult.song.list.length !== 0">
                    <v-list-item two-line tag="li" v-for="(item, index) in searchResultSong" :key="index" class="pa-0" @click="$router.push(`/song/${item.mid}`)">
                        <v-list-item-avatar>
                            {{index + 1}}
                        </v-list-item-avatar>
                        <v-list-item-content>
                            <v-list-item-title>{{item.name}}</v-list-item-title>
                            <v-list-item-subtitle>
                                <span v-for="(singer, idx) in item.singer" :key="idx">{{singer.name}}<span
                                        v-if="idx !== item.singer.length - 1"> / </span></span>
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </ul>
                <p class="text-center mb-0 pink--text text--accent-1" v-if="this.$store.state.load.loading">Loading...</p>
                <p class="text-center mb-0 pink--text text--accent-1" v-if="noMore">没有了诶...</p>
            </div>
        </v-container>
    </div>
</template>

<script>
    export default {
        name: "search",
        data: () => ({
            searchWord: "",
            searchHistory: JSON.parse(window.sessionStorage.getItem("searchHistory")) || [],
            searchMsg: "",
            searchError: false,
            searchPage: 1,
            searchResult: {},
            searchResultSong: [],
            searchSuggest: [],
        }),
        computed: {
            noMore() {
                return this.searchResultSong >= this.searchResult.song.totalnum
            },
            disabled() {
                return this.$store.state.load.loading || this.noMore
            }
        },
        async created() {
            this.$store.commit("load/setLoad")
            try {
                await this._getSearchSuggest()
                this.$store.dispatch("load/endLoad")
            } catch (err) {
                console.log(err)
            }
        },
        methods: {
            async _getSearchSuggest() {
                try {
                    const searchSuggest = await this.$axios.get("/getHotkey")
                    if (searchSuggest.status === 200) {
                        if (searchSuggest.data.response.code === 0) {
                            this.searchSuggest = searchSuggest.data.response.data.hotkey
                        } else {
                            console.log("热门搜索推荐获取失败")
                        }
                    } else {
                        console.log("网络错误")
                    }
                } catch (err) {
                    console.log(err)
                }
            },
            async search() {
                if (!this.searchWord || this.searchWord === "") {
                    this.searchMsg = "请输入搜索词"
                    this.searchResult = {}
                    this.searchResultSong = []
                    this.searchError = true
                    this.hideMsg()
                    return
                }
                this.saveSearchHistory(this.searchWord)
                try {
                    const search = await this.$axios.get(`/getSearchByKey?key=${this.searchWord}&page=${this.searchPage}`)
                    if (search.status === 200) {
                        if (search.data.response.code === 0) {
                            if(search.data.response.data.keyword !== this.searchResult.keyword) {
                                this.searchResultSong = []
                            }
                            this.searchResult = search.data.response.data
                            this.searchResultSong.push(...this.searchResult.song.list)
                        } else {
                            console.log("搜索失败")
                        }
                    } else {
                        console.log("网络错误")
                    }
                } catch (err) {
                    console.log(err)
                }
                this.searchMsg = "搜索成功"
                this.hideMsg()
            },
            hideMsg() {
                setTimeout(() => {
                    this.searchMsg = ""
                    this.searchError = false
                }, 2000)
            },
            load() {
                this.$store.commit("load/setLoad")
                this.searchPage += 1
                this.search()
                this.$store.dispatch("load/endLoad")
            },
            saveSearchHistory(word) {
                const index = this.searchHistory.findIndex(v => v === word)
                if(index !== -1) {
                    this.searchHistory.splice(index, 1)
                }
                this.searchHistory.push(word)
                window.sessionStorage.setItem("searchHistory", JSON.stringify(this.searchHistory))
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>