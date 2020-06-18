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
    async created() {
        this.$store.commit("load/setLoad")
        try {
          await this._getRank();
          this.$store.dispatch("load/endLoad")
        }catch(err) {
          console.log(err)
        }
    },
    methods: {
        async _getRank() {
            const rankListUrl = "/qqmusic?data={%22comm%22:{%22g_tk%22:5381,%22uin%22:%22%22,%22format%22:%22json%22,%22inCharset%22:%22utf-8%22,%22outCharset%22:%22utf-8%22,%22notice%22:0,%22platform%22:%22h5%22,%22needNewCode%22:1,%22ct%22:23,%22cv%22:0},%22topList%22:{%22module%22:%22musicToplist.ToplistInfoServer%22,%22method%22:%22GetAll%22,%22param%22:{}}}"
            try {
                const response = await this.$axios.get(rankListUrl)
                if (response.status === 200 && response.data.code === 0) {
                    const data = response.data.topList
                    if (data.code === 0) {
                        this.rankList = data.data.group
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

</style>