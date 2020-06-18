/**
 *
 * @Description: 发起网络请求
 * @Author: Owen
 * @Date: 2019-06-11 16:42
 *
 */

import axios from 'axios'

import { outputUrl } from '../utils'
import { RequestConfig } from '@/types/request.type'

const Message = window.$message
const Loading = window.$loading
let loginTimer: number
let loadingInstance: any

export default function dispatchRequest(requestConfig: RequestConfig): Promise<any> {
  const { isLoading = true } = requestConfig
  const config: any = transformConfig(requestConfig)
  let isExportFail: boolean = false

  if (typeof config === 'string') {
    Message.warning(config)
    return Promise.reject(config)
  } else {
    isExportFail = config.isExportFail
    delete  config.isExportFail
  }

  return (
    new Promise((resolve) => {
      axios(config)
        .then((body: any) => {
          clearTimeout(loginTimer)
          closeLoading(isLoading, loadingInstance)
          
          if (
            body.data.code === 200 ||
            body.request.responseURL.includes('mini/denglu')
          ) {
            resolve(body)
          } else {
            if (isExportFail) {
              body.code = 0
              // 因为 await 是不会响应 reject 的
              resolve(body)
            }

            return Message.error(body.data && body.data.msg || '系统维护中，请稍后再试！')
          }

        })
        .catch((fail: any) => {
          clearTimeout(loginTimer)
          closeLoading(isLoading, loadingInstance)

          if (isExportFail) {
            fail.code = 0
            // 因为 await 是不会响应 reject 的
            resolve(fail)
          }

          let message: string

          switch (fail.status) {
            /// token 经常无效 跳转登录页
            case 401 :
              message = fail.data && fail.data.msg || '登录超时，请重新登录！'
              window.token = null;
              localStorage.clear();
              window.location.reload()
              break
            case 404 :
              message = '服务端路由不存在！'
              break
            default:
              message = fail.data && fail.data.msg || '系统维护中，请稍后再试！'
          }

          Message.error(message)
        })
    })
  )
}

/**
 *
 * @description: 处理 requestConfig
 * @param {requestConfig} 请求配置
 * @return {}
 *
 */

function transformConfig(requestConfig: RequestConfig): any {
  let { method = 'get', url, query, isLoading = true, isToken = true, isExportFail = false } = requestConfig
  let headers: any = {}

  if (!url) {
    return 'url 不能为空'
  }
  const isForget = localStorage.getItem('forgetPassword')
  if (handleHeader() === false && !isForget) {
    return '登录超时，请重新登录！'
  }
  handleLoading()
  handleUrl()

  function handleHeader(): boolean | undefined {
    if (isToken) {
      if (window.token) {
        headers = {
          Authorization: window.token
        }
      } else {
        return false
      }
    }
  }

  function handleLoading() {
    if (isLoading) {
      clearTimeout(loginTimer)

      loginTimer = setTimeout(() => {
        loadingInstance = Loading.service({
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0)',
          customClass: 'loading'
        })
      }, 100)
    }
  }

  function handleUrl() {
    if (query && Object.keys(query).length) {
      url += '?' + outputUrl(query)
    }
  }

  return {
    method,
    url,
    data: requestConfig.body || {},
    headers,
    isExportFail
  }
}

/**
 *
 * @description: 关闭加载弹窗
 * @param {Boolean} 判断是否开启了弹窗
 * @param {Object} 弹窗实例
 * @return: void
 *
 */

function closeLoading(isLoading: boolean = false, loadingInstance: any) {
  if (isLoading && loadingInstance) {
    loadingInstance.close()
  }
}
