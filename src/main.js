import './assets/css/reset.css'
import './assets/css/style.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { Toast } from 'vant';

// 只在开发环境启用VConsole (dev/development模式)
if (import.meta.env.DEV || import.meta.env.MODE === 'dev' || import.meta.env.MODE === 'development') {
  import('vconsole').then(VConsole => {
    new VConsole.default()
  })
}

createApp(App).use(Toast).use(router).mount('#app')
