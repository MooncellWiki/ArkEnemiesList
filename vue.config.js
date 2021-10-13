/* eslint-disable */

const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

module.exports = {
  transpileDependencies: ['vuetify'],
  devServer: {
    proxy: {
      '/index.php': {
        target: 'https://prts.wiki',
        changeOrigin: true,
      },
    },
  },
}
