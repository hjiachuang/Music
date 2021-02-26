# Music -- 一个基于Vue框架开发的WebApp
### 页面上的展示的内容服务均来自QQ音乐。
<div align="center">

![GitHub watchers](https://img.shields.io/github/watchers/hjiachuang/Music?style=social) ![GitHub stars](https://img.shields.io/github/stars/hjiachuang/Music?style=social) ![GitHub forks](https://img.shields.io/github/forks/hjiachuang/Music?style=social)

![GitHub repo size](https://img.shields.io/github/repo-size/hjiachuang/Music?style=flat-square) ![GitHub package.json version](https://img.shields.io/github/package-json/v/hjiachuang/Music?style=flat-square) ![GitHub open issues](https://img.shields.io/github/issues/hjiachuang/Music?style=flat-square) ![GitHub closed issues](https://img.shields.io/github/issues-closed/hjiachuang/Music) ![GitHub last commit](https://img.shields.io/github/last-commit/hjiachuang/Music?style=flat-square) ![GitHub top language](https://img.shields.io/github/languages/top/hjiachuang/Music?style=flat-square)

![推荐页截图](https://api.aidioute.cn/resource/music_demo/images/recommend.png)
</div>

#### 线上地址：[Music](http://music.aidioute.cn)
> 当前代码仅共学习，不可做商业用途

### 更新
版本 0.1.1
1. 添加了列表显示当前播放的歌曲。
2. 修复了移动端浏览器在设备锁屏或者后台运行时，定时器不执行的bug，问题表现为不会自动播放下一首。
3. 添加了gz压缩，提升了页面打开速度。

### 关于项目

**灵感来自**

[Vue2.0开发企业级移动端音乐Web App](https://coding.imooc.com/class/107.html)

**参考内容**

[Vue](https://cn.vuejs.org/)

[Vuex](https://vuex.vuejs.org/zh/)

[Axios](https://github.com/axios/axios)

[Vuetify](https://vuetifyjs.com/zh-Hans/)

[Element-UI](https://element.eleme.cn/#/zh-CN)

### 📝 项目不足

1. 歌曲播放页面，歌词同步滚动动画的添加，技术不足，不知道如何下手，所以只是很生硬的跳下一句而已;

2. 未对各种移动端/浏览器的适配性做测试，仅测试了PC端下的chrome浏览器和firefox浏览器模拟移动端窗口。在```华为荣耀V10```手机中，不管什么浏览器都无法显示图片，这是一个尚无法找到问题的bug，在华为荣耀20中则显示正常。

### 🤝 贡献
该应用使用了开源的QQ音乐API，以下是来源，在此感谢 **Rain120**

> [qq-music-api](https://github.com/Rain120/qq-music-api)  --  **Rain120**

由于API存在部分bug，我自己还添加了一个从 **酷我音乐** 搜索歌曲播放连接的API，因此重新开了个代码仓库存了我自己的 ```qq-music-api```，感兴趣的可以从[这里](https://github.com/hjiachuang/qq-music-api) **git** 它。
