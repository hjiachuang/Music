<template>
    <div class="song" v-loading.fullscreen="loading">
        <div class="song-header">
            <v-app-bar fixed class="elevation-0" color="transparent">
                <v-app-bar-nav-icon @click="$router.go(-1)">
                    <v-icon style="color: black">mdi-chevron-left</v-icon>
                </v-app-bar-nav-icon>
                <v-list-item two-line v-if="songInfo.hasOwnProperty('track_info')">
                    <v-list-item-content>
                        <v-list-item-title>{{songInfo['track_info'].name}}</v-list-item-title>
                        <v-list-item-subtitle @click="toSinger">
                            <span v-for="(item, index) in songInfo['track_info'].singer" :key="index">
                            {{item.name}}
                            <span v-if="index !== (songInfo['track_info'].singer.length) - 1">/</span>
                            </span>
                            <v-icon dense>mdi-chevron-right</v-icon>
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <v-spacer></v-spacer>
            </v-app-bar>
            <!--占坑用-->
            <v-app-bar class="elevation-0"></v-app-bar>
        </div>
    </div>
</template>

<script>
    export default {
        name: "song",
        data: () => ({
            songInfo: {},
            loading: false
        }),
        created() {
            this.loading = true
            this._getSongDetail()
            setTimeout(() => {
                this.loading = false
            }, 500)
        },
        methods: {
            async _getSongDetail() {
                const id = this.$route.params.id
                try{
                    const data = await this.$axios.get(`/api/getSongInfo?songmid=${id}`)
                    if(data.status === 200) {
                        if(data.data.response.code === 0 && data.data.response.songinfo.code === 0) {
                            this.songInfo = data.data.response.songinfo.data
                        }
                    }
                }catch(err) {
                    console.log(err)
                }
            },
            toSinger() {
                let singer
                if(this.songInfo.hasOwnProperty('track_info')) {
                    singer = this.songInfo['track_info'].singer
                    if(singer.length === 0) {
                        //没有歌手，忽略
                        return false
                    }
                    if(singer.length === 1) {
                        //才一个歌手直接跳转
                        this.$router.push(`/artist/detail/${singer[0].mid}?name=${singer[0].name}`)
                    }else {
                        //大于一个歌手，请选择其中一个。
                        const html = singer.reduce((sum, v) => {
                            return sum + `<a href="#/artist/detail/${v.mid}?name=${v.name}">${v.name}</a>`
                        }, "")
                        // const html = `
                        // <template>
                        //     <h4 v-for="item in singer" :key="item.mid">{{item.name}}</h4>
                        // </template>
                        // `
                        this.$mesbox.alert(html,"请选择要查看的歌手", {
                            customClass: "mes-box",
                            dangerouslyUseHTMLString: true,
                            showConfirmButton: false
                        })
                    }
                }
            }
        }
    }
</script>

<style lang="scss">
.song {
    .song-header {
        height: 56px;
        overflow: hidden;
    }
}
.mes-box {
    position: fixed;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    a {
        display: block;
        font-size: 16px;
        font-weight: bold;
        margin: 6px 4px;
        padding: 0;
        height: 40px;
        line-height: 40px;
        text-decoration: none;
        color: #000;
    }
}
</style>