<template>
    <div class="rank">
        <template v-for="(list, index1) in rankList">
            <v-card class="mx-auto my-2" max-width="90%" v-for="(item, index2) in list.toplist" :key="`${index1}.${index2}`" @click="$router.push(`/rank/${item.topId}?name=${item.title}&period=${item.period}`)">
                <v-container class="pa-2">
                    <v-row no-gutters justify="space-between">
                        <v-col cols="4" class="pl-2">
                          <v-img width="100%" :src="item.frontPicUrl" style="border-radius: 4px">
                                <v-card-subtitle class="pa-0 caption text-right" style="position: absolute; bottom: 0; right: 4px; width: 100%; color: white;">
                                  <v-icon class="caption mr-1" color="white">mdi-music</v-icon><span>{{item.listenNum | listenNum}}</span>
                                </v-card-subtitle>
                          </v-img>
                        </v-col>
                        <v-col cols="8" class="pl-0 d-flex flex-column justify-space-between">
                            <h1 class="pl-2 subtitle-1 font-weight-black">{{item.title}}</h1>
                            <ul class="pl-2 d-flex flex-column justify-space-around" style="list-style: none; flex: 1;">
                                <li class="text-truncate caption" v-for="(song, index3) in item.song" :key="index3">
                                    <span class="font-weight-black">{{index3 + 1}}.</span>
                                    <span class="font-weight-medium">{{song.title}} - </span>
                                    <span class="font-weight-light">{{song.singerName}}</span>
                                </li>
                            </ul>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>
        </template>
    </div>
</template>

<script>
export default {
    name: 'rank',
    data: () => ({
        rankList: []
    }),
    filters: {
        listenNum(val) {
            if (Math.floor(val / 100000000) >= 1) {
                return Math.floor(val / 100000000) + "亿";
            } else if (Math.floor(val / 10000) >= 1) {
                return Math.floor(val / 10000) + "万";
            } else {
                return val;
            }
        }
    },
    created() {
        this.$store.commit("load/setLoad")
        this._getRank();
        this.$store.dispatch("load/endLoad")
    },
    methods: {
        async _getRank() {
            const rankListUrl = "/getTopLists"
            try {
                const data = await this.$axios.get(rankListUrl)
                if (data.status === 200) {
                    if(data.data.response.code === 0 && data.data.response.topList.code === 0) {
                        this.rankList = data.data.response.topList.data.group
                    }else {
                        console.error("获取排行榜榜单失败, code:", data.data.response.code, data.data.response.topList.code)
                        this.$message.error("获取排行榜榜单失败")
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

</style>