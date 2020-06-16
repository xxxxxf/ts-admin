/**
 *
 * @Description: system 模块路由
 * @Author: Owen
 * @Date: 2019-06-11 17:40
 *
 */

export default [
  {
    path: 'classification',
    name: 'classification',
    component: () => import(/* webpackChunkName: "dye-finish" */ '@/views/Pylons/classification.vue'),
    meta: {
      title: '挂架分类'
    }
  },
  {
    path: 'information',
    name: 'information',
    component: () => import(/* webpackChunkName: "dye-finish" */ '@/views/Pylons/information.vue'),
    meta: {
      title: '挂架信息'
    }
  },
  {
    path: 'borrow',
    name: 'borrow',
    component: () => import(/* webpackChunkName: "dye-finish" */ '@/views/Pylons/borrow.vue'),
    meta: {
      title: '挂架借阅'
    }
  },
  {
    path: 'borrowingQuery',
    name: 'borrowingQuery',
    component: () => import(/* webpackChunkName: "dye-finish" */ '@/views/Pylons/borrowingQuery.vue'),
    meta: {
      title: '借阅查询'
    }
  }
  

]
