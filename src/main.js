import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import './index.css'
import App from './App.vue'
import Nav from './Nav.vue'

Vue.use(ElementUI)

new Vue({
  el: '#nav',
  render: h => h(Nav)
})

new Vue({
  el: '#app',
  render: h => h(App)
})
