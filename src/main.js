// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.css'

new Vue({
  router,
  template: `
    <div id="app">
      <router-view class="view"></router-view>
    </div>
  `
}).$mount('#app')