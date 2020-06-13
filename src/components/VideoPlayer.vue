<template>
    <div class="video-player">
        <div class="video-player-container" :style="`width: ${width}px; height: ${height}px; overflow: hidden`">
            <video ref="video" :width="width" :height="height" :src="curUrl" webkit-playsinline playsinline x5-playsinline x-webkit-airplay="allow"></video>
            <div class="video-player-contorl" @mouseenter="showContorlMethod" @click="showContorlMethod">
                <div class="video-player-cover" :style="`background-image: url('${coverImg}')`" v-if="!played"></div>
                <div class="video-player-mask" v-if="!played"></div>
                <div class="video-player-choice-clarity" v-if="!played">
                    <v-chip class="ma-2 float-right" small color="green" text-color="white" @click="showChoiceBox = true">{{clarity[curClarity]}}</v-chip>
                    <div class="choice-box" v-if="showChoiceBox">
                        <p v-for="(item, index) in clarity" :key="index" @click="choiceClarity(index)" :style="url[url.length-index-1].url.length > 0? 'color: #fff':'color: grey'">{{item}}</p>
                    </div>
                </div>
                <div class="video-player-playicon" v-if="showContorl">
                    <v-btn class="play-icon" icon color="white" @click.stop="play">
                        <v-icon v-if="!playing">mdi-play-circle-outline</v-icon>
                        <v-icon v-else>mdi-pause-circle-outline</v-icon>
                    </v-btn>
                </div>
                <div class="video-player-bottom" v-if="showContorl">
                    <v-row class="align-center">
                        <v-col class="overline pa-0 text-center white--text" cols="2">{{'00:00'}}</v-col>
                        <v-col class="pa-0">
                            <v-slider hide-details v-model="progress" :color="'green accent-4'" :thumb-color="'green accent-5'" :track-color="'grey'"></v-slider>
                        </v-col>
                        <v-col class="overline pa-0 text-center white--text" cols="2">{{'00:00'}}</v-col>
                    </v-row>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Video-Player",
        props: {
            url: {
                type: Array,
                default: () => []
            },
            coverImg: {
                type: String
            }
        },
        data: () => ({
            curUrl: "",
            curClarity: 0,
            clarity: ['1080P','720P','480P','360P'],
            urlIndex: 0,
            progress: 0,
            width: "",
            height: "",
            playing: false,
            played: false,
            showContorl: true,
            timer: null,
            showChoiceBox: false
        }),
        mounted() {
            this.initVideo()
            this.choiceUrl()
        },
        methods: {
            initVideo() {
                this.width = this.$refs.video.offsetWidth
                this.height = Math.ceil(this.width / 1.78)
            },
            choiceUrl() {
                this.curUrl = this.url[this.url.length-1-this.curClarity].url[this.urlIndex]
            },
            play() {
                const video = this.$refs.video
                if(video.paused) {
                    if(video.readyState !== 4) {
                        if(this.urlIndex + 1  < this.url[this.url.length-1-this.curClarity].url.length) {
                            this.urlIndex += 1
                            this.choiceUrl()
                            video.load()
                            video.play()
                        }else {
                            console.log("该分辨率下无可播放资源，请更改分辨率后尝试播放。")
                        }
                    }else {
                        video.play()
                        this.playing = true
                        this.played = true
                        this.showContorlMethod()
                    }
                }else {
                    video.pause()
                    this.playing =false
                    clearTimeout(this.timer)
                    this.showContorl = true
                }
            },
            showContorlMethod() {
                if(!this.played) {
                    return false
                }
                clearTimeout(this.timer)
                this.showContorl = true
                this.timer = setTimeout(() => {
                    this.showContorl = false
                }, 2000)
            },
            choiceClarity(num) {
                if(this.url[this.url.length-num-1].url.length > 0) {
                    this.showChoiceBox = false
                    this.curClarity = num
                    this.choiceUrl()
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
.video-player {
    position: relative;
    width: 100%;
    height: 100%;
    video {
        /*position: absolute;*/
        width: 100%;
        height: 100%;
    }
    .video-player-contorl {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        .video-player-cover {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-repeat: no-repeat;
            background-position: center;
            background-size: 100%;
        }
        .video-player-mask {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.3);
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
        .video-player-playicon {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            .play-icon {
                width: 48px;
                height: 48px;
                i {
                    width: 100%;
                    height: 100%;
                    line-height: 48px;
                    font-size: 46px;
                    text-align: center;
                }
            }
        }
        .video-player-bottom {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
        }
    }
}
</style>