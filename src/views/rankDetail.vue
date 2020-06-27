<template>
    <div class="rank-detail">
        <div class="rank-detail-container">
            <div class="rank-detail-bgp">
                <v-img class="rank-detail-img" :src="rankDetail.data.headPicUrl" v-if="rankDetail.hasOwnProperty('data')"></v-img>
            </div>
            <song-list :playlist="rankDetail.songInfoList" :playlist_id="rankDetail.data.titleDetail" v-if="rankDetail.hasOwnProperty('songInfoList') && rankDetail.hasOwnProperty('data')"></song-list>
        </div>
    </div>
</template>

<script>
    import SongList from '../components/SongList'
    export default {
        name: "rank-detail",
        components: { SongList },
        data: () => ({
            rankDetail: {}
        }),
        created() {
            this.$store.commit("load/setLoad")
            this._getRankDetail()
            this.$store.dispatch("load/endLoad")
        },
        methods: {
            async _getRankDetail() {
                const id = this.$route.params.id
                const period = this.$route.query.period
                try {
                    const data = await this.$axios.get(`/getRanks?topId=${id}&period=${period}`)
                    if(data.status === 200) {
                        if(data.data.response.code === 0) {
                            this.rankDetail = data.data.response.detail.data
                            this.rankDetail.songInfoList = data.data.response.detail.data.songInfoList.map( v => {
                                return {
                                    name: v.name || null,
                                    id: v.mid || null,
                                    albumId: v.album.pmid || null,
                                    albumName: v.album.name || null,
                                    mvId: v.mv.vid || null,
                                    mvName: v.mv.name || null,
                                    artists: v.singer.map(sing => {return {id: sing.mid, name: sing.name}}) || [],
                                    vip: v.sa,
                                    createTime: v.time_public || "1990-01-01",
                                    canPlay: true
                                }
                            })
                        }else {
                            console.error("获取排行榜单详情内容失败, code:", data.data.response.code)
                            this.$message.error("获取排行榜单详情内容失败")
                        }
                    }else {
                        console.error("网络错误, code:", data.status)
                        this.$message.error("网络错误")
                    }
                }catch(err) {
                    console.error(err)
                    this.$message.error("请求失败")
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
.rank-detail {
    position: fixed;
    top: 56px;
    left: 0;
    width: 100%;
    height: calc(100vh - 56px);
    overflow: hidden;
    .rank-detail-container {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: auto;
        .rank-detail-bgp {
            height: calc(100vw - 56px - 1rem);
            .rank-detail-img {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
            }
        }
    }
}
</style>