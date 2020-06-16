/**
 *
 * @Description: vue-router 初始化文件
 * @Author: Owen
 * @Date: 2019-06-11 16:53
 *
 */

import Vue from 'vue'
import VueRouter from 'vue-router'

import logisticsChildRouter from './moudules/logistics'
// import orderChildRouter from './moudules/order'
import pylons from './moudules/pylons'
import customer from './moudules/customer'
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
          path: '',
          name: 'Home',
          component: () => import(/* webpackChunkName: "index" */ '../views/home.vue'),
          meta: {
            title: '首页'
          }
        },
        {
          path: '/information',
          name: 'information',
          component: () => import(/* webpackChunkName: "login" */ '../views/persionInformation/information.vue'),
          meta: {
            title: '个人信息'
          }
        },
        {
          path: '/changeMobile',
          name: 'changeMobile',
          component: () => import(/* webpackChunkName: "login" */ '../views/persionInformation/changeMobile.vue'),
          meta: {
            title: '修改手机号'
          }
        },
        {
          path: '/changePassword',
          name: 'changePassword',
          component: () => import(/* webpackChunkName: "login" */ '../views/persionInformation/changePassword.vue'),
          meta: {
            title: '修改密码'
          }
        },
        {
          path: '/DataDictionary',
          name: 'DataDictionary',
          component: () => import(/* webpackChunkName: "login" */ '../views/DataDictionary/index.vue'),
          meta: {
            title: '数据字典'
          }
        },
        {
          path: 'customer',
          name: 'customer',
          component: () => import(/* webpackChunkName: "customerManagement" */ '../views/customer/index.vue'),
          meta: {
            title: '客户信息'
          },
          children: customer
        },
        {
          path: 'logistics',
          name: 'Logistics',
          component: () => import(/* webpackChunkName: "logisticsManagement" */ '../views/logistics/index.vue'),
          meta: {
            title: '物流管理'
          },
          // children: logisticsChildRouter
        },
        {
          path: 'order',
          name: 'Order',
          component: () => import(/* webpackChunkName: "orderManagement" */ '../views/order/index.vue'),
          meta: {
            title: '订单管理'
          },
          // children: orderChildRouter
        },
        {
          path: 'Pylons',
          name: 'Pylons',
          component: () => import(/* webpackChunkName: "dye-finish" */ '../views/Pylons/index.vue'),
          children: pylons
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
      path: '/forgetPassword',
      name: 'forgetPassword',
      component: () => import(/* webpackChunkName: "login" */ '../views/forgetPassword.vue'),
      meta: {
        title: '忘记密码'
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
