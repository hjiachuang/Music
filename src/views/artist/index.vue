<template>
    <div class="artist-index">
        <div class="artist-container">
            <v-tabs dark centered background-color="teal darken-3" show-arrows v-model="select.sex">
                <v-tabs-slider color="teal lighten-3"></v-tabs-slider>
                <v-tab v-for="(item, index) in type.sex" :key="index" style="min-width: 45px;" @click="_getSinger(select.area,select.genre,select.index,index)">
                    {{ item.name }}
                </v-tab>
            </v-tabs>
            <v-tabs dark background-color="teal darken-3" show-arrows v-model="select.area">
                <v-tabs-slider color="teal lighten-3"></v-tabs-slider>
                <v-tab v-for="(item, index) in type.area" :key="index" style="min-width: 45px;" @click="_getSinger(index,select.genre,select.index,select.sex)">
                    {{ item.name }}
                </v-tab>
            </v-tabs>
            <v-tabs dark background-color="teal darken-3" show-arrows v-model="select.genre">
                <v-tabs-slider color="teal lighten-3"></v-tabs-slider>
                <v-tab v-for="(item, index) in type.genre" :key="index" style="min-width: 45px;" @click="_getSinger(select.area,index,select.index,select.sex)">
                    {{ item.name }}
                </v-tab>
            </v-tabs>
            <v-tabs dark background-color="teal darken-3" show-arrows v-model="select.index">
                <v-tabs-slider color="teal lighten-3"></v-tabs-slider>
                <v-tab v-for="(item, index) in type.index" :key="index" style="min-width: 45px;" @click="_getSinger(select.area,select.genre,index,select.sex)">
                    {{ item.name }}
                </v-tab>
            </v-tabs>
            <v-container style="min-height: calc(100vh - 288px);">
                <v-row>
                    <v-col cols="4" class="px-2 py-1" style="min-height: 100px" v-for="(item, index) in singerlist.slice(0,15)" :key="index" @click="toDetail(item)">
                        <v-lazy :options="{threshold: .5}" transition="fade-transition">
                            <v-card class="mx-auto text-center" :elevation="0">
                                <v-lazy>
                                    <v-img class="mx-auto" style="border-radius: 6px" width="100%" height="100%" :src="item.singer_pic" lazy-src="../../assets/images/singer_300.png"/>
                                </v-lazy>
                                <v-card-text class="pa-0 text--primary">
                                    <h4>{{item.singer_name}}</h4>
                                </v-card-text>
                            </v-card>
                        </v-lazy>
                    </v-col>
                </v-row>
                <v-row v-infinite-scroll="load" infinite-scroll-disabled="disabled" infinite-scroll-distance="0" v-if="singerlist.length > 15">
                    <v-col cols="4" class="px-2 py-1" style="min-height: 40px" v-for="(item, index) in singerlist.slice(15)" :key="index" @click="toDetail(item)">
                        <v-lazy :options="{threshold: .5}" transition="fade-transition">
                            <v-card-text class="pa-0 text--primary">
                                <h4>{{item.singer_name}}</h4>
                            </v-card-text>
                        </v-lazy>
                    </v-col>
                </v-row>
            </v-container>
            <p class="text-center ma-2 green--text text--accent-4" v-if="this.$store.state.load.loading">Loading...</p>
            <p class="text-center ma-2 green--text text--accent-4" v-if="noMore">没有了诶...</p>
        </div>
    </div>
</template>

<script>
    import RollingSubtitles from '../../components/RollingSubtitles'
    export default {
        name: "artist-index",
        components: { RollingSubtitles },
        data: () => ({
            type: {
                area: [
                   {
                       id: -100,
                       name: "全部"
                   },
                   {
                       id: 200,
                       name: "内地"
                   },
                   {
                       id: 2,
                       name: "港台"
                   },
                   {
                       id: 3,
                       name: "韩国"
                   },
                   {
                       id: 4,
                       name: "日本"
                   },
                   {
                       id: 5,
                       name: "欧美"
                   },
                   {
                       id: 6,
                       name: "其他"
                   }
               ],
                genre: [
                   {
                       id: -100,
                       name: "全部"
                   },
                   {
                       id: 1,
                       name: "流行"
                   },
                   {
                       id: 2,
                       name: "摇滚"
                   },
                   {
                       id: 3,
                       name: "民谣"
                   },
                   {
                       id: 4,
                       name: "电子"
                   },
                   {
                       id: 5,
                       name: "爵士"
                   },
                   {
                       id: 6,
                       name: "嘻哈"
                   },
                   {
                       id: 8,
                       name: "R&B"
                   },
                   {
                       id: 9,
                       name: "轻音乐"
                   },
                   {
                       id: 10,
                       name: "民歌"
                   },
                   {
                       id: 14,
                       name: "古典"
                   },
                   {
                       id: 20,
                       name: "蓝调"
                   },
                   {
                       id: 25,
                       name: "乡村"
                   }
               ],
                index: [
                   {
                       id: -100,
                       name: "热门"
                   },
                   {
                       id: 1,
                       name: "A"
                   },
                   {
                       id: 2,
                       name: "B"
                   },
                   {
                       id: 3,
                       name: "C"
                   },
                   {
                       id: 4,
                       name: "D"
                   },
                   {
                       id: 5,
                       name: "E"
                   },
                   {
                       id: 6,
                       name: "F"
                   },
                   {
                       id: 7,
                       name: "G"
                   },
                   {
                       id: 8,
                       name: "H"
                   },
                   {
                       id: 9,
                       name: "I"
                   },
                   {
                       id: 10,
                       name: "J"
                   },
                   {
                       id: 11,
                       name: "K"
                   },
                   {
                       id: 12,
                       name: "L"
                   },
                   {
                       id: 13,
                       name: "M"
                   },
                   {
                       id: 14,
                       name: "N"
                   },
                   {
                       id: 15,
                       name: "O"
                   },
                   {
                       id: 16,
                       name: "P"
                   },
                   {
                       id: 17,
                       name: "Q"
                   },
                   {
                       id: 18,
                       name: "R"
                   },
                   {
                       id: 19,
                       name: "S"
                   },
                   {
                       id: 20,
                       name: "T"
                   },
                   {
                       id: 21,
                       name: "U"
                   },
                   {
                       id: 22,
                       name: "V"
                   },
                   {
                       id: 23,
                       name: "W"
                   },
                   {
                       id: 24,
                       name: "X"
                   },
                   {
                       id: 25,
                       name: "Y"
                   },
                   {
                       id: 26,
                       name: "Z"
                   },
                   {
                       id: 27,
                       name: "#"
                   }
               ],
                sex: [
                   {
                       id: -100,
                       name: "全部"
                   },
                   {
                       id: 0,
                       name: "男"
                   },
                   {
                       id: 1,
                       name: "女"
                   },
                   {
                       id: 2,
                       name: "组合"
                   }
               ]
            },
            select: {
                area: 0,
                genre: 0,
                index: 0,
                sex: 0
            },
            singer: {
                area: 0,
                genre: 0,
                index: 0,
                sex: 0,
                singerlist: [],
                tags: {},
                total: 0
            },
            singerlist: [],
            page: 1,
            currentPage: 1
        }),
        computed: {
            noMore() {
                return this.singerlist.length >= this.singer.total
            },
            disabled() {
                return this.$store.state.load.loading || this.noMore
            }
        },
        created() {
            this.$store.commit("load/setLoad")
            try {
                this._getSinger(0,0,0,0)
                this.$store.dispatch("load/endLoad")
            }catch(err) {
                console.log(err)
            }
        },
        methods: {
            async _getSinger(area,genre,index,sex) {
                if(this.singer.area !== this.type.area[area].id || this.singer.genre !== this.type.genre[genre].id || this.singer.index !== this.type.index[index].id || this.singer.sex !== this.type.sex[sex].id) {
                    this.singer = {
                        area: 0,
                        genre: 0,
                        index: 0,
                        sex: 0,
                        singerlist: [],
                        tags: {},
                        total: 0
                    }
                    this.singerlist = []
                    this.page = 1
                }else {
                    if(this.page === this.currentPage) {
                        return
                    }
                }
                try{
                    const data = await this.$axios.get(`/getSingerList?area=${this.type.area[area].id}&sex=${this.type.sex[sex].id}&index=${this.type.index[index].id}&genre=${this.type.genre[genre].id}&page=${this.page}`)
                    if(data.status === 200) {
                        if(data.data.response.code === 0 && data.data.response.singerList.code === 0) {
                            this.singer = data.data.response.singerList.data
                            this.singerlist.push( ...data.data.response.singerList.data.singerlist )
                            this.currentPage = this.page
                        }else {
                            console.log("没有找到对应的歌手诶。")
                        }
                    }else {
                        console.log("网络错误")
                    }
                }catch(err) {
                    console.log(err)
                }

            },
            load() {
                this.$store.commit("load/setLoad");
                this.page += 1
                this._getSinger(this.select.area,this.select.genre,this.select.index,this.select.sex)
                this.$store.dispatch("load/endLoad");
            },
            toDetail(artist) {
                this.$router.push(`/artist/detail/${artist.singer_mid}?name=${encodeURIComponent(artist.singer_name)}`)
            }
        }
    }
</script>

<style lang="scss" scoped>
.artist-index {
    width: 100%;
    height: calc(100vh - 56px);
    overflow: hidden;
    .artist-container {
        width: 100%;
        height: 100%;
        overflow: auto;
    }
}
</style>