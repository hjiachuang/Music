<template>
    <div class="player" ref="playerFather" @click="$router.push(`/song/${playId}`)">
        <v-card class="player-fixed" ref="player" >
            <v-container class="pa-2">
                <v-row no-gutters justify="space-between">
                    <v-col cols="2" class="pl-2">
                      <v-img width="100%" :src="playImg"></v-img>
                    </v-col>
                    <v-col cols="6" class="pl-0 d-flex flex-column justify-space-around">
                        <p class="mb-0 font-weight-bold" style="font-size: 0.875rem; width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap">{{playName}}</p>
                        <p class="mb-0 d-inline-block text-truncate font-weight-light" style="max-width: 100%; font-size: 0.8rem">
                            <span v-for="(item, index) in playArtists" :key="index">
                            {{item.name}}
                            <span v-if="index !== (playArtists.length) - 1">/</span>
                            </span>
                        </p>
                    </v-col>
                    <v-col cols="3" class="d-flex align-center mr-2">
                        <div class="d-flex justify-space-between" style="width: 100%">
                            <v-btn small icon color="green accent-4" @click.stop="previous"><v-icon>mdi mdi-skip-previous</v-icon></v-btn>
                            <v-btn small icon color="green accent-4" @click.stop="play" v-if="playing && !player.ended"><v-icon>mdi mdi-pause-circle-outline</v-icon></v-btn>
                            <v-btn small icon color="green accent-4" @click.stop="play" v-else><v-icon>mdi mdi-play-circle-outline</v-icon></v-btn>
                            <v-btn small icon color="green accent-4" @click.stop="next"><v-icon>mdi mdi-skip-next</v-icon></v-btn>
                        </div>
                    </v-col>
                </v-row>
            </v-container>
            <v-progress-linear bottom class="progress" :value="progress" color="green accent-4"></v-progress-linear>
        </v-card>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    data: () => ({
        progress: 0,
        timer: null
    }),
    computed: {
        ...mapState({
            player: state => state.player.player,
            playName: state => state.player.play_name,
            playArtists: state => state.player.play_artists,
            playImg: state => state.player.play_img,
            playing: state => state.player.playing,
            playId: state => state.player.play_id
        })
    },
    mounted() {
        clearInterval(this.timer)
        this.timer = setInterval(()=>{
            const player = this.player
            const currentTime = player.currentTime
            const duration = player.duration
            this.progress = currentTime/duration * 100
        }, 100) 
    },
    methods: {
        previous() {
            this.$store.dispatch("player/previous")
        },
        next() {
            this.$store.dispatch("player/next")
        },
        play() {
            if(this.$store.state.player.playing && !this.$store.state.player.player.ended) {
                this.$store.commit("player/pause")
            }else {
                this.$store.commit("player/play")
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.player {
    height: 75px;
    .player-fixed {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 75px;
        .progress {
            position: absolute;
            height: 2px;
        }
    }
}
</style>