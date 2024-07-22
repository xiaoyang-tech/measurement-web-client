import Vue from 'vue'
import App from './App.vue'
import store from './store'
import './style/reset.css'
import 'vant/lib/index.css'

import router from './router'

Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
