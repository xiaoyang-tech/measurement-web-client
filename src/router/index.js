import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'

Vue.use(VueRouter)
const original = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return original.call(this, location).catch(err => err)
}
const routes = [
  {
    path: '/',
    name: 'v2',
    component: () => import(/* webpackChunkName: "about" */ '../views/v2')
  },
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
