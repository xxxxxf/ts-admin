export default [
    {
      path: 'customerManagement/:id',
      name: 'customerManagement',
      component: () => import(/* webpackChunkName: "customerManagement" */ '@/views/customer/customerManagement.vue'),
      meta: {
        title: '客户信息'
      }
    },
    {
      path: 'customerManagement',
      name: 'customerManagement',
      component: () => import(/* webpackChunkName: "customerManagement" */ '@/views/customer/customerManagement.vue'),
      meta: {
        title: '客户信息'
      }
    }
  
  ]