/**
 *
 * @Description:  常用的方法集合，使用于所有项目
 * @Author: Owen
 * @Date: 2019-06-11 16:29
 *
 */

/**
 *
 * @description: 将一个对象转换成路由参数
 * @param {Object} query
 * @return: String 路由参数
 *
 */
function outputUrl(query: any) {
  if (!isObject(query)) {
    return console.warn('query 必须是一个 Object')
  }

  let url = ''

  for (let key in query) {
    if (query.hasOwnProperty(key)) {
      url += `&${key}=${encodeURIComponent(query[key])}`
    }
  }

  return url.slice(1)
}

/**
 *
 * @description: 判断是否是一个对象
 * @param {any} 需要进行判断的参数
 * @return: Boolean
 *
 */
function isObject(query: any) {
  return Object.prototype.toString.call(query) === '[object Object]'

}

/**
 *
 * @description: 防抖函数
 * @param {any} callback
 * @param {number} 延迟时间
 * @return: void
 *
 */
let timer: number | null

function imageStabilization(callback: any, timeout: number = 300): void {
  clearTimeout(timer || 0)
  timer = setTimeout(() => {
    callback()
    clearTimeout(timer || 0)
    timer = null
  }, timeout)
}

/**
 *
 * @description: 节流函数
 * @param {any} callback
 * @param {number} 延迟时间
 * @return: void
 *
 */
let preTime: number | null = null

function throttle(callback: any, timeout: number = 50): void {
  let currentTime = new Date().getTime()

  if (!preTime) {
    preTime = currentTime
  }

  if (currentTime - preTime > timeout) {
    preTime = null
    callback()
  }
}

/**
 *
 * @description: 合并对象
 * @param {to} 源对象
 * @param {from} 需要合并的对象
 * @return {any}
 *
 */

function extend<T, U>(to: T, from: U, source: string[]): T & U {
  source.forEach(key => {
    (to as any)[key] = (from as any)[key]
  })
  return to as T & U
}

/**
 *
 * @description: 判断 element 里面是否有 className
 * @param {element} 目标 dom
 * @param {className} 类名
 * @return {}
 *
 */

function hasClass(element: HTMLDivElement, className: string) {
  if (element.className.includes(className)) {
    return true
  }

  return false
}

/**
 *
 * @description: 给 element 元素添加 className
 * @param {element} 目标 dom
 * @param {className} 类名
 * @return {}
 *
 */

function addClass(element: HTMLDivElement, className: string) {
  element.className = `${ element.className.trim() } ${ className }`
}

/**
 *
 * @description: 删除 element 元素上的 className
 * @param {element} 目标 dom
 * @param {className} 类名
 * @return {}
 *
 */

function removeClass(element: HTMLDivElement, className: string) {
  element.className = element.className.replace(className, '').trim()
}

export {
  outputUrl,
  isObject,
  imageStabilization,
  extend,
  throttle,
  hasClass,
  addClass,
  removeClass
}
