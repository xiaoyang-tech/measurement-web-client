import { createRouter, createWebHistory } from 'vue-router'
import measurement from '../views/measurement/index.vue'
import Sao from '../views/sao2/index.vue'

const routes = [
  { path: '/', component: measurement },
  { path: '/sao2', name: 'sao2', component: Sao },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // 与 Vite base 对齐
  routes
})

export default router