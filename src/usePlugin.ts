/**
 *
 * @Description: 使用自定义的一些插件
 * @Author: Owen
 * @Date: 2019-07-02 15:03
 *
 */

import Vue from 'vue'

import { domain, prefix } from '@/config/config'
import * as filters from './filters'
import { imageStabilization } from '@/utils/utils'
import { isHasPromise } from '@/utils/robot'

const request = () => import(/* webpackChunkName: "usePlugin" */ '@/utils/axios')
const FilterData = () => import(/* webpackChunkName: "usePlugin" */ '@/utils/filterData')
const CheckRequired = () => import(/* webpackChunkName: "usePlugin" */ '@/utils/checkRequired')

Object.keys(filters).forEach(key => {
  // @ts-ignore
  Vue.filter(key, filters[key])
})

window.token = localStorage.getItem('accessToken')
window.$imageStabilization = imageStabilization
request()
  .then(body => {
      window.$request = body.default({
        domain,
        prefix,
        timeout: 10000
      })
    }
  )
FilterData()
  .then(body => {
      window.$filterData = body.default
    }
  )
CheckRequired()
  .then(body => {
      window.$checkRequired = body.default()
    }
  )

// 在 Vue.prototype 上添加公共方法
Vue.prototype.$isHasPromise = isHasPromise
