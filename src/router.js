import Vue from 'vue'
import Router from 'vue-router'
// import ping from './components/ping.vue'
import Login from './components/Login.vue'

Vue.use(Router)

export default new Router({
  routes: [
    // { path: '/', name: 'ping', component: ping },
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login }
  ]
})
