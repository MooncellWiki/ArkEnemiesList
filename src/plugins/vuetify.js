import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'

Vue.use(Vuetify)
// Translation provided by Vuetify (javascript)
import zhHans from 'vuetify/es5/locale/zh-Hans'
import en from 'vuetify/es5/locale/en'
import ja from 'vuetify/es5/locale/ja'

export default new Vuetify({
  lang: {
    locales: { zhHans, en, ja },
    current: 'zhHans',
  },
})
