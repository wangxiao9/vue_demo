import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from './router'
import './assets/css/global.css'
import axios from 'axios'
import './assets/fonts/iconfont.css'
// 配置请求路径
axios.defaults.baseURL = 'http://127.0.0.1:5000/api/v1'
// 挂载在Vue原型对象上
Vue.prototype.$http = axios

Vue.config.productionTip = false
Vue.prototype.$http = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
