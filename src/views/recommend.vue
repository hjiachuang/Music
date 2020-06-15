<template>
    <div class="recommend">
        <v-container fluid class="pt-0">
            <!--导航 标题-->
            <v-row v-if="false">
                <v-col cols="12" class="title font-weight-bold personal-title">指引</v-col>
            </v-row>
            <!--导航 内容-->
            <v-row no-gutters class="mt-6" v-if="true">
                <v-col cols="3" class="text-center" v-for="(item, index) in navigate" :key="index" @click="toPage(item.path)">
                    <v-img class="ma-auto" width="50" height="50" src="../assets/images/dayRecommend.png"></v-img>
                    <p class="subtitle-2 font-weight-bold">{{item.name}}</p>
                </v-col>
            </v-row>
            <!--推荐歌单 标题-->
            <v-row>
                <v-col cols="12" class="title font-weight-bold personal-title">推荐歌单</v-col>
            </v-row>
            <!--推荐歌单 内容-->
            <v-row no-gutters>
                <v-col cols="4" class="pa-1" v-for="(item, index) in playlists" :key="index" @click="$router.push(`/playlist/detail/${item.content_id}?name=${encodeURIComponent(item.title)}`)">
                    <v-card class="mx-auto text-center" :elevation="0">
                        <v-img class="mx-auto" style="border-radius: 6px" width="100%" height="100%" :src="item.cover"/>
                        <v-card-text class="pa-0 text--primary">
                          <rolling-subtitles :text="item.title" fontSize="0.875rem" class="mt-1"/>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <!--最新专辑 标题-->
            <v-row>
                <v-col cols="12" class="title font-weight-bold personal-title">最新专辑</v-col>
            </v-row>
            <!--最新专辑 内容-->
            <v-row no-gutters>
                <v-col cols="4" class="pa-1" v-for="(item, index) in newalbum" :key="index" @click="$router.push(`/album/detail/${item.mid}?name=${encodeURIComponent(item.name)}`)">
                    <v-card class="mx-auto text-center" :elevation="0">
                        <v-img class="mx-auto" style="border-radius: 6px" width="100%" height="100%" :src="`https://y.gtimg.cn/music/photo_new/T002R300x300M000${item.mid}.jpg?max_age=2592000`"/>
                        <v-card-text class="pa-0 text--primary">
                          <div>{{item.name}}</div>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <!--最新音乐 标题-->
            <v-row>
                <v-col cols="12" class="title font-weight-bold personal-title">最新音乐</v-col>
            </v-row>
            <div class="newsong">
                <v-row v-for="(item, index) in newsong" :key="index" @click="$router.push(`/song/${item.mid}`)">
                    <v-col cols="3">
                        <v-lazy>
                            <v-img class="mx-auto align-center text-center" style="border-radius: 6px" width="100%" height="100%" :src="`https://y.gtimg.cn/music/photo_new/T002R300x300M000${item.album.pmid}.jpg?max_age=2592000`">
                              <v-icon class="white--text" v-if="$store.state.player.play_id === item.id && $store.state.player.playing && !$store.state.player.player.ended" @click="playSong(index, item.id)">mdi-pause-circle-outline</v-icon>
                              <v-icon class="white--text" v-else @click="playSong(index, item.id)">mdi-play-circle-outline</v-icon>
                            </v-img>
                        </v-lazy>
                    </v-col>
                    <v-col cols="9" class="d-flex flex-column justify-space-around">
                        <rolling-subtitles style="height: auto" :text="item.name" fontSize="0.875rem" :fontWeight="800"/>
                        <rolling-subtitles style="height: auto" :text="item.singer | artist" fontSize="0.775rem" :fontWeight="400"/>
                    </v-col>
                </v-row>
            </div>
        </v-container>
    </div>
</template>

<script>
import RollingSubtitles from '../components/RollingSubtitles'
export default {
    name: 'recommend',
    components: { RollingSubtitles },
    data: () => ({
        navigate: [
            {
                name: "歌单",
                path: "/playlist"
            },
            {
                name: "歌手",
                path: "/artist"
            },
            {
                name: "新碟",
                path: "/album"
            },
            {
                name: "MV",
                path: "/mv"
            }
        ],
        playlists: [],
        newalbum: [],
        newsong: []
    }),
    async created() {
        try {
          await this._getRecommend();
        }catch(err) {
          console.log(err)
        }
    },
    methods: {
        async _getRecommend() {
          try {
            const response = await this.$axios.get("/api/getRecommend")
            if (response.status === 200 && response.data.response.code === 0) {
              const data = response.data.response
              if(data.recomPlaylist.code === 0) this.playlists = data.recomPlaylist.data["v_hot"]
              if(data["new_album"].code === 0) this.newalbum = data["new_album"].data.albums
              if(data["new_song"].code === 0) this.newsong = data["new_song"].data.songlist
            }
          }catch(err) {
            console.log(err)
          }
        },
        playSong(index, id) {
          if (this.$store.state.player.play_id !== id) {
            this.$store.dispatch("player/index", {
              lists: this.newsong,
              lists_id: this.$time('YMD') + '/newsong',
              index: index,
              type: "empty"
            });
          } else {
            if (this.$store.state.player.player.paused) {
              this.$store.commit("player/play")
            } else {
              this.$store.commit("player/pause");
            }
          }
        },
        toPage(path) {
          this.$router.push(path)
        }
    },
    filters: {
        artist(arr) {
            return arr.reduce((sum, v, i) => {
                sum += v.name
                if(i !== arr.length - 1) {
                    sum += ' / '
                }
                return sum
            }, "")
        }
    }
}
</script>

<style lang="scss" scoped>
.recommend {
    .personal-title {
        font-family: '宋体', Tahoma, Verdana, STHeiTi, simsun, sans-serif !important;
        text-shadow: 0 0 #000;
    }
}
</style>