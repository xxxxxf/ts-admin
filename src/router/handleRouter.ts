/**
 *
 * @Description: 对路由钩子的一些处理文件
 * @Author: Owen
 * @Date: 2019-06-11 16:57
 *
 */

import Router from './index'
import { getPageTitle } from '@/utils/robot'
import Progress from '@/utils/progress'
import '@/assets/css/progress.scss'

let progress: any = Progress({})

const Login: string = '/login'
const HOME_URL: string = '/index'
Router.beforeEach((to, from, next): void => {
  progress.start()
  document.title = getPageTitle(to.meta.title)
  // if (!window.token && to.path === forgetPassword) {
  //   progress.close()
  //   return next()
  // }
  if (!window.token && to.path !== Login) {
    progress.close()

    return next(Login)
  }

  if (
    window.token &&
    to.path === Login
  ) {
    progress.close()

    return next(HOME_URL)
  }

  if (
    window.token &&
    to.path === '' ||
    to.path === '/'
  ) {
    return next(HOME_URL)
  }

  next()
})

Router.afterEach((to: any, from: any): void => {
  progress.close()
})
