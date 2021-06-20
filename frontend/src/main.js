import Vue from 'vue'
import App from './App.vue'
import Axios from 'axios'

Vue.config.productionTip = false

const axios = Axios
axios.defaults.baseURL = 'http://localhost:3000'
Vue.prototype.$axios = axios

new Vue({
  render: h => h(App),
}).$mount('#app')
