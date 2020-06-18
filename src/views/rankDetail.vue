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
                    const data = await this.$axios.get(`/api/getRanks?topId=${id}&period=${period}`)
                    if(data.status === 200) {
                        if(data.data.response.code === 0) {
                            this.rankDetail = data.data.response.detail.data
                        }
                    }else {
                        console.log("网络错误")
                    }
                }catch(err) {
                    console.log(err)
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