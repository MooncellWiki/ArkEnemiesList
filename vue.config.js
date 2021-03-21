/* eslint-disable */

const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

module.exports = {
  transpileDependencies: ['vuetify'],
  devServer: {
    proxy: {
      '/index.php': {
        target: 'http://prts.wiki',
        changeOrigin: true,
      },
    },
    host: '0.0.0.0',
    port: 3008,
    public: '0.0.0.0:3008',
  },
}
