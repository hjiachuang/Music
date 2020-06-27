<template>
    <div class="lyric" ref="lyric" @click="$emit('off')">
        <p v-for="(item, index) in lyricArr" :key="index" :class="{'green--text accent-4':item.active, 'lyric-item':true}">{{item.lyric}}</p>
    </div>
</template>

<script>
    export default {
        name: "Lyric",
        props: {
            lyric: {
                type: String,
                required: true
            },
            currentTime: {
                type: Number,
                required: true
            },
            playing: {
                type: Boolean,
                required: true
            }
        },
        data: () => ({
            lyricArr: [],
            lyricIndex: 0,
            timer: null,
            scrollTimer: null
        }),
        created() {
            this.changeLyric()
            this.showLyric()
        },
        watch: {
            lyric() {
                this.changeLyric()
                this.showLyric()
            },
            playing() {
                if(this.playing) {
                    this.showLyric()
                }else {
                    clearInterval(this.timer)
                }
            }
        },
        methods: {
            changeLyric() {
                this.lyricArr = this.lyric.split("\n").reduce((sum, v) => {
                    if(/^\[[0-9:.]*\]/.test(v)) {
                        const regArr = v.match(/(\[[0-9:.]*\])([\s\S]*)/)
                        const timeTemp = regArr[1].match(/(\d+):(\d+).(\d+)/)
                        const time = timeTemp[1] * 60 + parseInt(timeTemp[2]) + timeTemp[3] / 100
                        if(regArr[2].length > 0) {
                            sum.push({time, lyric: regArr[2], active: false})
                        }
                        return sum
                    }else {
                        return sum
                    }
                }, [])
            },
            showLyric() {
                clearInterval(this.timer)
                this.timer = setInterval(() => {
                    this.lyricArr.forEach(v => {
                        v.active = false
                    })
                    if(this.lyricArr.length > 1) {
                        for(let i = 0; i < this.lyricArr.length-1; i++) {
                            if(this.lyricArr[i].time <= this.currentTime && this.currentTime <= this.lyricArr[i+1].time) {
                                this.lyricArr[i].active = true
                                this.$refs.lyric.scrollTop = 50 * i
                                break
                            }
                        }
                    }
                    if(this.lyricArr[this.lyricArr.length - 1].time <= this.currentTime) {
                        this.lyricArr[this.lyricArr.length - 1].active = true
                    }
                }, 10)
            },
        },
        beforeDestroy() {
            clearInterval(this.timer)
        }
    }
</script>

<style lang="scss" scoped>
.lyric {
    position: relative;
    z-index: 1;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    padding: 55% 0;
    transition: all 1s;
    .lyric-item {
        margin: 0;
        /*height: 50px;*/
        line-height: 50px;
        text-align: center;
        color: white;
    }
}
</style>