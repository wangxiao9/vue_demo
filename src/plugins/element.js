import Vue from 'vue'
import { Button, Form, FormItem, Input, Message, Header, Aside, Main, Container, Menu, Submenu, MenuItem, MenuItemGroup } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Container)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)

// 挂载弹框属性到全局变量中
Vue.prototype.$message = Message
