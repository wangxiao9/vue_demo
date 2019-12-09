import Vue from 'vue'
import Router from 'vue-router'
// import ping from './components/ping.vue'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Users from './components/user/Users.vue'
import Welcome from './components/Welcome.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    // { path: '/', name: 'ping', component: ping },
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users }
      ]
    }
  ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to  将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  if (to.path === '/login') return next()
  // 获取token,判断是否存入token,如果没有跳转到登录页面，如果有，放行
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
