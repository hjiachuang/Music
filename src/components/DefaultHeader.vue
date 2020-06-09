<template>
    <div class="playlist-header">
        <v-app-bar fixed class="elevation-0" :color="backgroundColor">
            <v-app-bar-nav-icon @click="$router.go(-1)">
                <v-icon :style="`color: ${color}`">mdi-chevron-left</v-icon>
            </v-app-bar-nav-icon>
            <v-toolbar-title :style="`color: ${color}`">{{name}}</v-toolbar-title>
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
                        case /^\/playlist\/detail\/\d*$/.test(path):
                        case /^\/artist\/detail\/\d*$/.test(path):
                            this.color = 'white'
                            this.backgroundColor = 'transparent'
                            this.name = name
                            break
                    }
                }
            }
        }
    }
</script>