// const CompressionPlugin = require('compression-webpack-plugin')
const fs = require('fs')

// const Html = require('./html.config')

// cdn预加载使用
const externals = {
  'vue': 'Vue',
  'vue-router': 'VueRouter',
  'vuex': 'Vuex',
  'axios': 'axios',
  'element-ui': 'ELEMENT'
}

const cdn = {
  // 开发环境
  dev: {
    css: [
      // 'https://unpkg.com/element-ui/lib/theme-chalk/index.css'
    ],
    js: []
  },
  // 生产环境
  build: {
    css: [
      // 'https://unpkg.com/element-ui/lib/theme-chalk/index.css'
    ],
    js: [
      'https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js',
      'https://cdn.jsdelivr.net/npm/vue-router@3.0.3/dist/vue-router.min.js',
      'https://cdn.jsdelivr.net/npm/vuex@3.0.1/dist/vuex.min.js',
      'https://cdn.jsdelivr.net/npm/axios@0.18.0/dist/axios.min.js',
      'https://unpkg.com/element-ui@2.8.2/lib/index.js'
    ]
  }
}

const NODE_ENV = process.env.NODE_ENV

// let tempHtml = ''
//
// //  根据不同的打包环境，加载不同的模板
// switch (NODE_ENV) {
//   case 'development':
//     tempHtml = Html.html
//     break
//   case 'production':
//     if (process.env.VUE_APP_TITLE === 'cdn') {
//       tempHtml = Html.cdnHtml
//     } else {
//       tempHtml = Html.html
//     }
//     break
//   default:
//     console.log('没有匹配到任何模式')
// }
//
// fs.writeFileSync("./public/index.html", tempHtml)

module.exports = {
  publicPath: '/',

  css: {
    loaderOptions: {
      sass: {
        // 配置全局的 scss 数据
        data: `@import "@/assets/css/setting.scss";`
      }
    }
  },

  chainWebpack: config => {
    /**
     * 添加CDN参数到htmlWebpackPlugin配置中， 详见public/index.html 修改
     */
    config.plugin('html').tap(args => {
      if (process.env.NODE_ENV === 'production') {
        if (process.env.VUE_APP_TITLE === 'cdn') {
          args[0].cdn = cdn.build
        } else {
          args[0].cdn = cdn.dev
        }
      }
      if (process.env.NODE_ENV === 'development') {
        args[0].cdn = cdn.dev
      }
      return args
    })

    // if (process.env.NODE_ENV === 'production') {
    //   config
    //     .plugin('webpack-bundle-analyzer')
    //     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    // }

    // 移除 prefetch 插件
    config.plugins.delete('prefetch')
    // 移除 preload 插件
    config.plugins.delete('preload')
  },

  // 修改webpack config, 使其不打包externals下的资源
  configureWebpack: config => {
    const myConfig = {}

    if (process.env.NODE_ENV === 'production') {
      if (process.env.VUE_APP_TITLE === 'cdn') {
        // 1. 生产环境npm包转CDN
        myConfig.externals = externals
      } else {
        /**
         * 关闭host check，方便使用ngrok之类的内网转发工具
         */
        myConfig.devServer = {
          disableHostCheck: true
        }
      }

    }
    if (process.env.NODE_ENV === 'development') {
      /**
       * 关闭host check，方便使用ngrok之类的内网转发工具
       */
      myConfig.devServer = {
        disableHostCheck: true
      }
    }
    //  过滤生产环境的 console.log()
    if (process.env.NODE_ENV === 'production') {
      if (process.env.VUE_APP_TITLE !== 'test') {
        config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
      }
    }

    return myConfig
  },

  // 去除打包之后的 map 文件
  productionSourceMap: process.env.NODE_ENV === 'production' ? false : true,

  // configureWebpack: config => {
  //   if (process.env.NODE_ENV === 'production') {
  //     return {
  //       plugins: [new CompressionPlugin({
  //         test: /\.js$|\.html$|\.css/,  // 匹配文件名
  //         threshold: 10240, // 对超过 10k 的文件进行压缩
  //         deleteOriginalAssets: false  // 是否删除原文件
  //       })]
  //     }
  //   }
  // }
}
