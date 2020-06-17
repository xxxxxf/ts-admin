/**
 *
 * @Description: system 模块路由
 * @Author: Owen
 * @Date: 2019-06-11 17:40
 *
 */

export default [
  {
    path: 'dlist',
    name: 'dlist',
    component: () => import(/* webpackChunkName: "dye-finish" */ '@/views/diarys/d-list.vue'),
    meta: {
      title: '发布'
    }
  },
  {
    path: 'flist',
    name: 'flist',
    component: () => import(/* webpackChunkName: "dye-finish" */ '@/views/diarys/f-list.vue'),
    meta: {
      title: '反馈'
    }
  }
]
