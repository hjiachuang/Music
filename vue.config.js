const CompressionPlugin = require("compression-webpack-plugin")

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
  configureWebpack: (config) => {
    if(process.env.NODE_ENV === 'production') {
      config.mode = 'production'
      return {
        plugins: [new CompressionPlugin({
          test: /\.js$|\.html$|\.css/,
          threshold: 10240,
          deleteOriginalAssets: false
        })]
      }
    }
  }
}