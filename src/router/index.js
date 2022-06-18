import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'

Vue.use(VueRouter)


const routes = [
  {
    path: '/',
    name: '登录',
    component: Login,
    hidden: true
  },
  {
    path: '/home',
    name: '主页面',
    component: Home,
    children: []
  }
]

const router = new VueRouter({
  routes
})

export default router
