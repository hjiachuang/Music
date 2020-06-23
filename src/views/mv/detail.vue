<template>
    <div class="mv-detail">
        <div class="video-player" ref="video">
            <video-player class="vue-video-player" :options="playerOptions" :playsinline="true" @play="played = true; $store.commit('player/pause')" @pause="played = false; $store.commit('player/play')"></video-player>
            <div class="video-player-choice-clarity" v-if="!played">
                <v-chip class="ma-2 float-right" small color="green" text-color="white" @click="showChoiceBox = !showChoiceBox">{{clarity[curClarity]}}</v-chip>
                <div class="choice-box" v-if="showChoiceBox">
                    <p v-for="(item, index) in clarity" :key="index" @click="choiceClarity(index)" :style="urlInfo[index].url.length > 0? 'color: #fff':'color: grey'">{{item}}</p>
                </div>
            </div>
        </div>
        <v-container>
            <v-row>
                <v-col cols="12">
                    <v-icon class="mr-2">mdi-youtube</v-icon>
                    <span class="title font-weight-black">{{mvInfo.name}}</span>
                </v-col>
                <v-col cols="12" class="font-weight-light body-2">
                    <v-icon class="mr-2">mdi-account-outline</v-icon>
                    <span v-for="(item, index) in mvInfo.singers" :key="index">
                      {{item.name}}
                      <span v-if="index !== (mvInfo.singers.length) - 1">/</span>
                    </span>
                </v-col>
                <v-col cols="12" class="font-weight-light body-2">
                    <span>总播放 {{mvInfo.playcnt}} 次</span>
                </v-col>
                <v-col cols="12" class="font-weight-light body-2">
                    <span>创建时间 {{$time('Y-M-D',mvInfo.pubdate * 1000)}}</span>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
    import { videoPlayer } from 'vue-video-player'
    import 'video.js/dist/video-js.css'

    export default {
        name: "mv-detail",
        components: { videoPlayer },
        data: () => ({
            width: 0,
            height: 0,
            curClarity: 0,
            clarity: ['1080P','720P','480P','360P'],
            played: false,
            showChoiceBox: false,
            urlInfo: [],
            mvInfo: {},
            playerOptions: {
                playbackRates: [1.0, 1.25, 1.5, 2.0], //播放速度
                autoplay: false, //如果true,浏览器准备好时开始回放。
                muted: false, // 默认情况下将会消除任何音频。
                loop: false, // 导致视频一结束就重新开始。
                preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                language: 'zh-CN',
                aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                sources: [],
                poster: '', //你的封面地址
                // width: 414,
                notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                controlBar: {
                    timeDivider: true,
                    durationDisplay: true,
                    remainingTimeDisplay: false,
                    fullscreenToggle: true  //全屏按钮
                }
            }
        }),
        async created() {
            this.$store.commit("load/setLoad")
            await this._getMvDetail()
            this.$store.dispatch("load/endLoad")
        },
        mounted() {
            this.initVideo()
            this.playerOptions.width = this.width
            this.playerOptions.height = this.height
        },
        methods: {
            async _getMvDetail() {
                const id = this.$route.params.id
                try{
                    const data = await this.$axios.get(`/api/getMvPlay?vid=${id}`)
                    if(data.status === 200) {
                        if(data.data.response.code === 0 && data.data.response.getMVUrl.code === 0 && data.data.response.mvinfo.code === 0) {
                            const urlData = data.data.response.getMVUrl.data[id].mp4
                            this.urlInfo = [
                                {
                                    type: "1080P",
                                    url: urlData[4].freeflow_url
                                },
                                {
                                    type: "720P",
                                    url: urlData[3].freeflow_url
                                },
                                {
                                    type: "480P",
                                    url: urlData[2].freeflow_url
                                },
                                {
                                    type: "360P",
                                    url: urlData[1].freeflow_url
                                }
                            ]
                            this.mvInfo = data.data.response.mvinfo.data[id]
                        }
                    }
                }catch(err) {
                    console.log(err)
                }
            },
            initVideo() {
                this.width = this.$refs.video.offsetWidth
                this.height = Math.ceil(this.width / 1.78)
                this.$refs.video.style.height = this.height + 'px'
            },
            choiceClarity(num) {
                if(this.urlInfo[num].url.length > 0) {
                    this.showChoiceBox = false
                    this.curClarity = num
                }
            },
            choiceUrl() {
                while(true) {
                    if(this.urlInfo[this.curClarity].url.length === 0) {
                        this.curClarity += 1
                    }else {
                        break
                    }
                    if(this.curClarity === 3)  break
                }
                this.playerOptions.sources = this.urlInfo[this.curClarity].url.map(v => {
                    return {
                        src: v,
                        type: 'video/mp4'
                    }
                })
                this.playerOptions.poster = this.mvInfo.cover_pic
            }
        },
        watch: {
            urlInfo() {
                this.choiceUrl()
            },
            curClarity() {
                this.choiceUrl()
            }
        }
    }
</script>

<style lang="scss" scoped>
.mv-detail {
    .video-player {
        position: relative;
        .vue-video-player {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            width: 100%;
            height: 100%;
        }
        .video-player-choice-clarity {
            position: absolute;
            top: 0;
            right: 0;
            width: 100%;
            height: 30px;
            .choice-box {
                position: absolute;
                top: 38px;
                right: 8px;
                width: 100px;
                border-radius: 4px;
                background: rgba(0,0,0,0.5);
                p {
                    color: #fff;
                    line-height: 30px;
                    font-size: 14px;
                    text-align: center;
                    margin: 0;
                    padding: 0;
                    &:hover {
                        color: #4CAF50;
                    }
                }
            }
        }
    }
}
</style>