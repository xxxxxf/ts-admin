export default [
    {
      path: 'management',
      name: 'management',
      component: () => import(/* webpackChunkName: "customerManagement" */ '@/views/User/management.vue'),
      meta: {
        title: '用户管理'
      }
    }
  
  ]