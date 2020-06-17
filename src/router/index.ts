/**
 *
 * @Description: vue-router 初始化文件
 * @Author: Owen
 * @Date: 2019-06-11 16:53
 *
 */

import Vue from 'vue'
import VueRouter from 'vue-router'

// import orderChildRouter from './moudules/order'
import diarys from './moudules/diarys'
import User from './moudules/User'


Vue.use(VueRouter)

const DefaultLayout = () => import(/* webpackChunkName: "index" */ '../layout/index.vue')
const PrintLayout = () => import(/* webpackChunkName: "print-module" */ '../layout/print.vue')

const routes = [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: 'index',
          name: 'Home',
          component: () => import(/* webpackChunkName: "index" */ '../views/home.vue'),
          meta: {
            title: '首页'
          }
        },
        {
          path: 'Diarys',
          name: 'Diarys',
          component: () => import(/* webpackChunkName: "dye-finish" */ '../views/diarys/index.vue'),
          children: diarys
        },
        {
          path: 'User',
          name: 'User',
          component: () => import(/* webpackChunkName: "dye-finish" */ '../views/User/index.vue'),
          meta: {
            title: '系统管理'
          },
          children: User
        },
      ]
    },

    {
        path: '/print-module',
        component: PrintLayout,
        children: [
          {
            path: '',
            name: 'PrintDefault',
            component: () => import(/* webpackChunkName: "print-module" */ '../views/print-module/default.vue'),
          }
        ]
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import(/* webpackChunkName: "login" */ '../views/login.vue'),
      meta: {
        title: '登录'
      }
    },
    {
      path: '*',
      name: 'NotFound',
      component: () => import(/* webpackChunkName: "notFound" */ '../views/notFound.vue'),
      meta: {
        title: 'NotFound'
      }
    }
  ]
const Router = new VueRouter({
  mode: 'history',
  base: 'tech',
  routes
})

export default Router
