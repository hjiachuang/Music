<template>
    <div class="artist-detail">
        <div class="artist-detail-container" id="artist_detail_container" v-infinite-scroll="load" infinite-scroll-disabled="disabled" infinite-scroll-distance="0">
            <div class="artist-detail-bgp">
                <div class="artist-detail-bgp-bgp" :style="`background-image: url(${artist_detail.pic.big_white})`" v-if="artist_detail.hasOwnProperty('pic') && artist_detail.pic.hasOwnProperty('big_white') && artist_detail.pic.big_white !== ''"></div>
                <v-img :src="artist_detail.pic.pic" v-if="artist_detail.hasOwnProperty('pic') && artist_detail.pic.hasOwnProperty('pic') && artist_detail.pic.pic !== ''" lazy-src="../../assets/images/singer_300.png"></v-img>
                <div class="artist-detail-bgp-mask"></div>
            </div>
            <v-tabs style="margin-top: calc(100vw - 56px - 1rem);" color="green accent-4" centered>
                <v-tab @click="show = 'songlist'"><v-badge color="green" :content="artist_songList_total">歌曲</v-badge></v-tab>
                <v-tab @click="show = 'albumlist'"><v-badge color="green" :content="artist_albumList_total">专辑</v-badge></v-tab>
                <v-tab @click="show = 'mvlist'"><v-badge color="green" :content="artist_mvList_total">视频</v-badge></v-tab>
                <v-tab @click="show = 'about'">关于Ta</v-tab>

            </v-tabs>
            <song-list style="border-radius: 0;" :playlist="artist_songList" :playlist_id="artist_detail.basic_info.singer_mid" v-if="show === 'songlist' && artist_detail.hasOwnProperty('basic_info') && artist_detail.basic_info.hasOwnProperty('singer_mid')"></song-list>
            <album-list :albumlist="artist_albumList" v-if="show === 'albumlist'"></album-list>
            <div v-if="show === 'mvlist'" class="pt-3" style="position: relative; background-color: #fff">
                <v-slide-group show-arrows mandatory v-model="selectMvTag">
                    <v-slide-item v-for="item in artist_mv_tag" :key="item.id" v-slot:default="{ active, toggle }" @click="">
                        <v-btn class="mx-2" :input-value="active" active-class="green accent-4 white--text" depressed rounded @click="toggle();refresh(item.id)">
                            {{ item.name }}
                        </v-btn>
                    </v-slide-item>
                </v-slide-group>
                <video-list :videolist="artist_mvList"></video-list>
            </div>
            <div v-if="show === 'about'" class="px-4" style="position: relative; background-color: #fff; line-height: 1.5;">
                <ul class="px-0 pt-4" style="list-style: none;">
                    <li v-for="(item, index) in artist_detail.wiki.basic.item" :key="index">
                        <h4>{{item.key}}</h4>
                        <p class="mt-1 px-2">{{item.value}}</p>
                    </li>
                </ul>
                <div>
                    <h4>简介</h4>
                    <p class="mt-1 px-2" v-html="artist_detail.wiki.desc.replace(/\n/g,'<br>')"></p>
                </div>
                <ul class="px-0" style="list-style: none;">
                    <li v-for="(item, index) in artist_detail.wiki.other.item" :key="index">
                        <h4>{{item.key}}</h4>
                        <p class="mt-1 px-2" v-html="item.value.replace(/\n/g,'<br>')"></p>
                    </li>
                </ul>
            </div>
            <p class="text-center ma-0 pa-2 green--text text--accent-4" style="position: relative; background-color: #fff;" v-if="this.$store.state.load.loading">Loading...</p>
            <p class="text-center ma-0 pa-2 green--text text--accent-4" style="position: relative; background-color: #fff;" v-if="noMore">没有了诶...</p>
            <div class="player-placeholder" v-if="$store.state.player.play_id !== ''"></div>
<!--            <description :detail="artistDetail" v-show="descriptionShow" @show="descriptionShow = false"/>-->
        </div>
    </div>
</template>

<script>
    import X2JS from '../../plugins/xml2json'
    import SongList from '../../components/SongList'
    import AlbumList from '../../components/AlbumList'
    import VideoList from '../../components/VideoList'
    export default {
        name: "artist-detail",
        components: { SongList, AlbumList, VideoList },
        data: () => ({
            show: "songlist",
            songPage: 1,
            songLimit: 30,
            albumPage: 1,
            albumLimit: 30,
            mvPage: 1,
            mvLimit: 40,
            selectMvTag: 0,     // 选择“全部”分类的MV
            artist_detail: {},
            artist_songList_total: 0,
            artist_songList: [],
            artist_albumList_total: 0,
            artist_albumList: [],
            artist_mv_tag: [],
            artist_mvList_total: 0,
            artist_mvList: []
        }),
        computed: {
            noMore() {
                if(this.show === 'songlist') {
                    return this.artist_songList.length >= this.artist_songList_total
                }else if(this.show === 'albumlist') {
                    return this.artist_albumList.length >= this.artist_albumList_total
                }else if(this.show === 'mvlist') {
                    return this.artist_mvList.length >= this.artist_mvList_total
                }else {
                    return false
                }

            },
            disabled() {
                return this.$store.state.load.loading || this.noMore
            }
        },
        created() {
            try{
                this.$store.commit("load/setLoad");
                this._getArtistDesc();
                this._getArtistSonglist();
                this._getArtistAlbumlist();
                this._getArtistMvTag();
                this._getArtistMvlist();
                this.$store.dispatch("load/endLoad");
            }catch(err) {
                console.log(err)
            }
        },
        methods: {
            async _getArtistDesc() {
                try {
                    const mid = this.$route.params.id;
                    const url = `/api/getSingerDesc?singermid=${mid}`;
                    const data = await this.$axios.get(url);
                    if (data.status === 200) {
                        if (data.data.response.singerDetail.code === 0) {
                            this.artist_detail = data.data.response.singerDetail.data.singer_list[0]
                        } else {
                            console.log("获取歌手详情失败")
                        }
                        let xml = data.data.response.singerDetail.data.singer_list[0].wiki
                        xml = '<?xml version="1.0" encoding="utf-8"?>' + xml
                        this.artist_detail.wiki = new X2JS().xml_str2json(xml).info
                    } else {
                        console.log("网络错误")
                    }
                } catch (err) {
                    console.log(err);
                }
            },
            async _getArtistSonglist() {
                try {
                    const mid = this.$route.params.id;
                    const url = `/api/getSingerSonglist?singermid=${mid}&page=${this.songPage}&limit=${this.songLimit}`;
                    const data = await this.$axios.get(url);
                    if (data.status === 200) {
                        if (data.data.response.code === 0 && data.data.response.songList.code === 0) {
                            this.artist_songList_total = data.data.response.songList.data.totalNum
                            this.artist_songList.push( ...data.data.response.songList.data.songList.map( v => {
                                return {
                                    name: v.songInfo.name || null,
                                    id: v.songInfo.mid || null,
                                    albumId: v.songInfo.album.pmid || null,
                                    albumName: v.songInfo.album.name || null,
                                    mvId: v.songInfo.mv.vid || null,
                                    mvName: v.songInfo.mv.name || null,
                                    artists: v.songInfo.singer.map(sing => {return {id: sing.mid, name: sing.name}}) || [],
                                    vip: v.songInfo.sa,
                                    createTime: v.songInfo.time_public || "1990-01-01",
                                    canPlay: true
                                }
                            }))
                        } else {
                            console.log("获取歌手歌曲列表失败")
                        }
                    } else {
                        console.log("网络错误")
                    }
                } catch (err) {
                    console.log(err);
                }
            },
            async _getArtistAlbumlist() {
                try {
                    const mid = this.$route.params.id;
                    const url = `/api/getSingerAlbum?singermid=${mid}&page=${this.albumPage}&limit=${this.albumLimit}`;
                    const data = await this.$axios.get(url);
                    if (data.status === 200) {
                        if (data.data.response.code === 0 && data.data.response.albumList.code === 0) {
                            this.artist_albumList_total = data.data.response.albumList.data.total
                            this.artist_albumList.push(...data.data.response.albumList.data.albumList)
                        } else {
                            console.log("获取歌手专辑列表失败")
                        }
                    } else {
                        console.log("网络错误")
                    }
                } catch (err) {
                    console.log(err);
                }
            },
            async _getArtistMvTag() {
                try {
                    const mid = this.$route.params.id;
                    const url = `/api/getMvByTag?singermid=${mid}`;
                    const data = await this.$axios.get(url);
                    if (data.status === 200) {
                        if (data.data.response.code === 0 && data.data.response.mvTag.code === 0) {
                            this.artist_mv_tag = data.data.response.mvTag.data.list
                        } else {
                            console.log("获取歌手MV分类列表失败")
                        }
                    } else {
                        console.log("网络错误")
                    }
                } catch (err) {
                    console.log(err);
                }
            },
            async _getArtistMvlist( id=0 ) {
                try {
                    const mid = this.$route.params.id;
                    const url = `/api/getSingerMv?singermid=${mid}&page=${this.mvPage}&limit=${this.mvLimit}&tagid=${id}`;
                    const data = await this.$axios.get(url);
                    if (data.status === 200) {
                        if (data.data.response.code === 0 && data.data.response.mvList.code === 0) {
                            this.artist_mvList_total = data.data.response.mvList.data.total
                            this.artist_mvList.push(...data.data.response.mvList.data.list)
                        } else {
                            console.log("获取歌手MV列表失败")
                        }
                    } else {
                        console.log("网络错误")
                    }
                } catch (err) {
                    console.log(err);
                }
            },
            refresh(id) {
                this.mvPage = 1
                this.artist_mvList = []
                this._getArtistMvlist(id)
            },
            load() {
                this.$store.commit("load/setLoad");
                if(this.show === 'songlist') {
                    this.songPage +=1
                    this._getArtistSonglist()

                }else if(this.show === 'albumlist') {
                    this.albumPage +=1
                    this._getArtistAlbumlist()
                }else if(this.show === 'mvlist') {
                    this.mvPage += 1
                    this._getArtistMvlist(this.artist_mv_tag[this.selectMvTag].id)
                }else {
                    this.$store.dispatch("load/endLoad");
                }
                setTimeout(() => {
                    this.$store.dispatch("load/endLoad");
                }, 500)
            }
        }
    };
</script>

<style lang="scss" scoped>
    .artist-detail {
        position: fixed;
        top: 56px;
        left: 0;
        width: 100%;
        height: calc(100vh - 56px);
        overflow: hidden;
        .artist-detail-container {
            position: relative;
            width: 100%;
            height: 100%;
            overflow: auto;
            .artist-detail-bgp {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                /*filter: blur(10px);*/
                background-color: rgba(18,23,24,.1);
                .artist-detail-bgp-bgp {
                    width: 100%;
                    height: 100vw;
                    background-repeat: no-repeat;
                    background-size: auto 100%;
                    background-position: center 0;
                }
                .artist-detail-bgp-mask {
                    position: absolute;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(18,23,24,.1);
                }
            }
            .player-placeholder {
                width: 100%;
                height: 75px;
            }
        }
    }
</style>