<template>
    <div class="playlist-header">
        <v-app-bar fixed class="elevation-0" :color="backgroundColor">
            <v-app-bar-nav-icon @click="$router.go(-1)">
                <v-icon :style="`color: ${color}`">mdi-chevron-left</v-icon>
            </v-app-bar-nav-icon>
            <v-toolbar-title :style="`color: ${color}`" @click="goToTop">{{name}}</v-toolbar-title>
            <v-spacer></v-spacer>
        </v-app-bar>
        <!--占坑用-->
        <v-app-bar class="elevation-0"></v-app-bar>
    </div>
</template>

<script>
    export default {
        name: "playlist-header",
        data: () => ({
            color: "",
            backgroundColor: "",
            name: ""
        }),
        watch: {
            $route() {
                const path = this.$route.path
                const name = this.$route.query.name
                this.checkPath(path, name)
            }
        },
        created() {
            const path = this.$route.path
            const name = this.$route.query.name
            this.checkPath(path, name)
        },
        methods: {
            checkPath(path, name) {
                if(path) {
                    switch (true) {
                        case /^\/playlist$/.test(path):
                        case /^\/playlist\/$/.test(path):
                            this.color = 'black'
                            this.backgroundColor = 'white'
                            this.name = '歌单广场'
                            break
                        case /^\/artist$/.test(path):
                        case /^\/artist\/$/.test(path):
                            this.color = 'black'
                            this.backgroundColor = 'white'
                            this.name = '全部歌手'
                            break
                        case /^\/album\/new$/.test(path):
                        case /^\/album\/new\/$/.test(path):
                            this.color = 'black'
                            this.backgroundColor = 'white'
                            this.name = '新碟首发'
                            break
                        case /^\/mv$/.test(path):
                        case /^\/mv\/$/.test(path):
                            this.color = 'black'
                            this.backgroundColor = 'white'
                            this.name = 'MV'
                            break
                        case /^\/playlist\/detail\/\d*$/.test(path):
                        case /^\/artist\/detail\/[A-Za-z0-9]*$/.test(path):
                        case /^\/album\/detail\/[A-Za-z0-9]*$/.test(path):
                        case /^\/rank\/[A-Za-z0-9]*$/.test(path):
                            this.color = 'white'
                            this.backgroundColor = 'transparent'
                            this.name = name
                            break
                        case /^\/mv\/detail\/[A-Za-z0-9]*$/.test(path):
                            this.color = 'black'
                            this.backgroundColor = 'white'
                            this.name = name
                            break
                    }
                }
            },
            goToTop() {
                console.log("返回顶部")
                document.getElementById('artist_detail_container').scrollTop = '0px'
            }
        }
    }
</script>