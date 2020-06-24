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
        target: "http://localhost:3000",
        changeOrigin: true,  //是否跨域
        pathRewrite:{
          '^/api':''
        }
      }
    }
  },
}