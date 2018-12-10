// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import index from './components/IndexPage'
import router from './router'
import 'bootstrap/dist/css/bootstrap.css'
import Chart from 'v-chart-plugin'

Vue.use(Chart);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { index },
  template: '<index/>'
})