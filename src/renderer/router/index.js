import Vue from 'vue'
import Router from 'vue-router'
import userPage from '@/components/LandingPage/Userpage'
import addPage from '@/components/LandingPage/New'
import miniWindow from '@/components/LandingPage/MiniWindow'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home-page',
      component: require('@/components/Home').default
    },
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/user',
      name: 'user',
      component: userPage
    },
    {
      path: '/add',
      name: 'add-page',
      component: addPage
    },
    {
      path: '/miniWindow',
      name: 'miniWindow',
      component: miniWindow
    }
  ]
})
