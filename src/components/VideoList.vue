<template>
    <div class="videolist" style="position: relative; background-color: #fff;">
        <v-container>
            <v-row>
                <v-col cols="6" class="pb-1" style="position: relative;" v-for="(item, index) in videolist" :key="index">
<!--                    <img :src="item.picurl" :alt="item.title" style="width: 100%; object-fit: cover">-->
                    <v-img :src="item.picurl" style="border-radius: 0.5rem;" aspect-ratio="1.778"></v-img>
                    <p class="body-2 mt-2 mb-0" style="line-height: 0.9rem; height: 0.9rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{item.title}}</p>
                    <div style="position: absolute; bottom: 1.8rem; left: 0; right: 0;">
                        <span class="white--text ml-5 float-left" style="font-size: 11px;">{{$time('Y-M-D',item.pubdate * 1000)}}</span>
                        <span class="white--text mr-5 float-right" style="font-size: 11px;"><v-icon class="white--text" style="font-size: 16px;vertical-align: top;">mdi-video-outline</v-icon>{{item.playcnt | num}}</span>
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
    export default {
        name: "VideoList",
        props: {
            videolist: {
                type: Array,
                default: () => []
            }
        },
        filters: {
            num(val) {
                if (Math.floor(val / 100000000) >= 1) {
                    return (val / 100000000).toFixed(1) + "亿";
                } else if (Math.floor(val / 10000) >= 1) {
                    return (val / 10000).toFixed(1) + "万";
                } else {
                    return val;
                }
            }
        }
    }
</script>

<style scoped>

</style>