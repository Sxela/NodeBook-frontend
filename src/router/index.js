import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/IndexPage'
import address from '@/components/AddressPage'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/:id', 
      component: address, 
      name: 'address',
      props: true
    },
    {
      path: '/',
      name: 'index',
      component: index
    }
  ],
  linkActiveClass: "active"
})



