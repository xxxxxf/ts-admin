/**
 *
 * @Description: 处理一些零散的功能，适用于当前项目
 * @Author: Owen
 * @Date: 2019-06-11 16:37
 *
 */

import { title } from '../config/config'

/**
 *
 * @description: 获取路由中的 title 属性
 * @param { String }
 * @return { String }
 *
 */
export function getPageTitle(pageTitle: string): string {
  return pageTitle || title
}


/**
 *
 * @description: 判断当前是否有权限
 * @param {promiseType} 权限分类
 * @param {promise} 拥有的所有权限
 * @return {boolean}
 *
 */

export function isHasPromise(promiseType: string, promise: string[]): boolean {
  if (promise[0] === '*') {
    return true
  }

  if (promise.includes(promiseType)) {
    return true
  }

  return false
}


/**
 *
 * @description: 获取颜色分类方法
 * @param {color} 颜色分类值
 * @return {string}
 */

export function byColor(color: any): string {
  enum colorValue {'深' = 1, '中', '浅', '白'}

  return colorValue[color as number] || '-'
}
