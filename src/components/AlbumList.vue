<template>
    <div class="albumlist">
        <div class="albumitem" v-for="(item,index) in albumlist" :key="index" @click="toPage(`/album/detail/${item.albumMid}?name=${item.albumName}`)">
            <div class="albumitem-pic">
                <img :src="`https://y.qq.com/music/photo_new/T002R300x300M000${item.albumMid}_1.jpg?max_age=2592000`" alt="">
                <i></i>
            </div>
            <div class="albumitem-info">
                <span class="name">{{item.albumName}}</span>
                <div class="other">
                    <span>{{item.publishDate}}</span>
<!--                    <span>{{item.size}}首</span>-->
                </div>
            </div>
            <v-icon>mdi-chevron-right</v-icon>
        </div>
    </div>
</template>

<script>
    export default {
        name: "AlbumList",
        data() {
            return {}
        },
        props: {
            albumlist: {
                type: Array,
                required: true
            },
        },
        methods: {
            toPage(path) {
                this.$router.push(path)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .albumlist {
        position: relative;
        background: #fff;
        .albumitem {
            height: 70px;
            margin-left: 18px;
            display: flex;
            align-items: center;
            .albumitem-pic {
                width: 60px;
                height: 60px;
                position: relative;
                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 8px;
                    position: relative;
                    z-index: 1;
                }
                i {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    position: absolute;
                    top: 0;
                    left: 6px;
                    z-index: 0;
                    background: #ccc;
                }
            }
            .albumitem-info {
                width: calc(100% - 116px);
                height: 60px;
                margin-left: 20px;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                .name {
                    font-size: 16px;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
                .other {
                    font-size: 12px;
                    span {
                        margin-right:4px;
                    }
                }
            }
        }
    }
</style>