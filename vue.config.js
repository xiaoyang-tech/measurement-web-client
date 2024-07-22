const path = require('path')
console.log(process.env.VUE_APP_DEV_URL)
module.exports = {
  publicPath: ['production', 'development', 'dev'].includes(process.env.ENV) ? './' : '/web-app',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    // host: '0.0.0.0',
    // public: '192.168.2.212',
    port: 8080,
    open: true,
    https: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
    }
    // before: require('./mock/mock-server.js')
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    module: {
      rules: [
        {
          test: /\.(proto)$/i,
          use: [
            {
              loader: 'protobufjs-loader',
              options: {
                /* loader options */
              },
            },
          ],
        },
      ],
    },
  }
}
