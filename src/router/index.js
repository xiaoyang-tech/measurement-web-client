import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../views/measurement/index.vue')
  },
  {
    path: '/sao2',
    name: 'sao2',
    component: () => import('../views/sao2/index.vue')
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router