import Vue from 'vue'
import App from './App.vue'
import Axios from 'axios'
import Router from 'vue-router'

import Home from './pages/HomePage.vue'
import Add from './pages/AddPage.vue'

Vue.use(Router)

Vue.config.productionTip = false

const axios = Axios
axios.defaults.baseURL = 'http://localhost:3000'
Vue.prototype.$axios = axios

const router = new Router({
  routes: [
    { path: '/', component: Home, meta: { title: 'Weather App' } },
    { path: '/Add', component: Add, meta: { title: 'Add City' } }
  ],
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
