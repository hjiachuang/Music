<template>
    <div class="mv-index">
        <div class="mv-index-container"  v-infinite-scroll="load" infinite-scroll-disabled="disabled" infinite-scroll-distance="0">
            <v-tabs dark centered background-color="teal darken-3" show-arrows>
                <v-tabs-slider color="teal lighten-3"></v-tabs-slider>
                <v-tab v-for="(item, index) in area" :key="index" style="min-width: 45px;" @click="selectVersion = 0;getMv(index, selectVersion)">
                    {{ item.name }}
                </v-tab>
            </v-tabs>
            <v-tabs dark centered background-color="teal darken-3" show-arrows :value="selectVersion">
                <v-tabs-slider color="teal lighten-3"></v-tabs-slider>
                <v-tab v-for="(item, index) in version" :key="index" style="min-width: 45px;" @click="getMv(selectArea, index)">
                    {{ item.name }}
                </v-tab>
            </v-tabs>
            <p class="text-right overline mx-2 mt-2 mb-0 black--text" v-if="mvList.length > 0">共有{{mvTotal}}条结果</p>
            <video-list :videolist="mvList" v-if="mvList.length > 0"></video-list>
            <p class="text-center ma-2 green--text text--accent-4" v-if="this.$store.state.load.loading">Loading...</p>
            <p class="text-center ma-2 green--text text--accent-4" v-if="noMore">没有了诶...</p>
        </div>
    </div>
</template>

<script>
    import VideoList from '../../components/VideoList'
    export default {
        name: "mv-index",
        components: { VideoList },
        data: () => ({
            area: [
                {
                    "id": 15,
                    "name": "全部"
                },
                {
                    "id": 16,
                    "name": "内地"
                },
                {
                    "id": 17,
                    "name": "港台"
                },
                {
                    "id": 18,
                    "name": "欧美"
                },
                {
                    "id": 19,
                    "name": "韩国"
                },
                {
                    "id": 20,
                    "name": "日本"
                }
            ],
            version: [
                {
                    "id": 7,
                    "name": "全部"
                },
                {
                    "id": 8,
                    "name": "MV"
                },
                {
                    "id": 9,
                    "name": "现场"
                },
                {
                    "id": 10,
                    "name": "翻唱"
                },
                {
                    "id": 11,
                    "name": "舞蹈"
                },
                {
                    "id": 12,
                    "name": "影视"
                },
                {
                    "id": 13,
                    "name": "综艺"
                },
                {
                    "id": 14,
                    "name": "儿歌"
                }
            ],
            selectArea: 0,
            selectVersion: 0,
            page: 1,
            limit: 30,
            mvList: [],
            mvTotal: 0
        }),
        computed: {
            noMore() {
                return this.mvList.length >= this.mvTotal
            },
            disabled() {
                return this.$store.state.load.loading || this.noMore
            }
        },
        created() {
            this.$store.commit("load/setLoad")
            this._getMv()
            this.$store.dispatch("load/endLoad")
        },
        methods: {
            async _getMv(area=0, version=0) {
                try{
                    const data = await this.$axios.get(`/api/getMv?area_id=${this.area[area].id}&version_id=${this.version[version].id}&page=${this.page}&limit=${this.limit}`)
                    if(data.status === 200) {
                        if(data.data.response.code === 0 && data.data.response.mv_list.code === 0) {
                            this.mvTotal = data.data.response.mv_list.data.total
                            this.mvList.push( ...data.data.response.mv_list.data.list )
                            this.selectArea = area
                            this.selectVersion = version
                        }else {
                            console.log("获取MV列表失败")
                        }
                    }else {
                        console.log("网络错误")
                    }
                }catch(err) {
                    console.log(err)
                }
            },
            getMv(area, version) {
                if(area !== this.selectArea || version !== this.selectVersion) {
                    this.page = 1
                    this.mvList = []
                    this.mvTotal = 0
                    this.$store.commit("load/setLoad")
                    this._getMv(area, version)
                    this.$store.dispatch("load/endLoad")
                }
            },
            load() {
                this.$store.commit("load/setLoad")
                this.page += 1
                this._getMv(this.selectArea, this.selectVersion)
                this.$store.dispatch("load/endLoad")
            }
        }
    }
</script>

<style lang="scss" scoped>
.mv-index {
    position: fixed;
    top: 56px;
    left: 0;
    width: 100%;
    height: calc(100vh - 56px);
    overflow: hidden;
    .mv-index-container {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: auto;
    }
}
</style>