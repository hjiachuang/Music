module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  devServer: {
    port: 8088,
    hot: true,
    open: true,
    proxy: {
      '/api': {
        target: "http://localhost:3200",
        changeOrigin: true,
        pathRewrite:{
          '^/api':''
        }
      },
      '/url': {
        target: "http://192.168.1.10:2020",
        changeOrigin: true,
        pathRewrite:{
          '^/url':'/api'
        }
      },
      '/qqmusic': {
        target: "http://u.y.qq.com/cgi-bin/musicu.fcg",
        changeOrigin: true,
        pathRewrite:{
          '^/qqmusic':''
        }
      },
      '/cloudmusic': {
        target: "http://interface.music.163.com",
        changeOrigin: true,
        pathRewrite:{
          '^/cloudmusic':''
        }
      }
    }
  },
}