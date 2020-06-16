/**
 *
 * @Description: 发货
 * @Author: xyd
 * @Date: 2019-8-22 15:18:27
 *
 */

export default [
  {
    path: 'waitShip',
    name: 'WaitShip',
    component: () => import(/* webpackChunkName: "system" */ '@/views/logistics/wait-ship/index.vue'),
    meta: {
      title: '待发货订单'
    }
  },
  {
    path: 'finishShip',
    name: 'FinishShip',
    component: () => import(/* webpackChunkName: "system" */ '@/views/logistics/finish-ship/index.vue'),
    meta: {
      title: '已发货订单'
    }
  },
]
