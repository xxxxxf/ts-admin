/**
 *
 * @Description: Axios 类
 * @Author: Owen
 * @Date: 2019-07-02 16:52
 *
 */

import axios from 'axios'

import { BaseConfig, RequestConfig } from '@/types/request.type'
import dispatchRequest from './dispatchRequest'

export default class Axios {
  constructor(config: BaseConfig) {
    this.initRequest(config)
  }

  /**
   *
   * @description: request
   * @param {requestConfig}
   * @return {}
   *
   */

  public request(requestConfig: RequestConfig): Promise<any> {
    return dispatchRequest(requestConfig)
  }

  /**
   *
   * @description: get, head, delete, options, post, put, patch
   * @param {requestConfig}
   * @return {}
   *
   */

  public get(url: string, requestConfig?: RequestConfig): Promise<any> {
    return this.handleRequest('get', url, requestConfig)
  }

  public head(url: string, requestConfig?: RequestConfig): Promise<any> {
    return this.handleRequest('head', url, requestConfig)
  }

  public delete(url: string, requestConfig?: RequestConfig): Promise<any> {
    return this.handleRequest('delete', url, requestConfig)
  }

  public options(url: string, requestConfig?: RequestConfig): Promise<any> {
    return this.handleRequest('options', url, requestConfig)
  }

  public post(url: string, requestConfig?: RequestConfig): Promise<any> {
    return this.handleRequest('post', url, requestConfig)
  }

  public put(url: string, requestConfig?: RequestConfig): Promise<any> {
    return this.handleRequest('put', url, requestConfig)
  }

  public patch(url: string, requestConfig?: RequestConfig): Promise<any> {
    return this.handleRequest('patch', url, requestConfig)
  }

  /**
   *
   * @description: 初始化
   * @param {config} 基本配置
   * @return {}
   *
   */

  private initRequest(config: BaseConfig) {
    axios.defaults.baseURL = this.transformBaseUrl(config)
    axios.defaults.timeout = config.timeout

    this.initInterceptors()
  }

  /**
   *
   * @description: 处理不同请求方式的请求
   * @param {url} 路由
   * @param {requestConfig} 请求配置
   * @return {}
   *
   */

  private handleRequest(method: string, url: string, requestConfig?: RequestConfig): Promise<any> {
    let config: RequestConfig

    if (requestConfig === undefined) {
      config = {
        method,
        url
      }
    } else {
      config = requestConfig
      config.method = method
      config.url = url
    }

    return this.request(config)
  }

  /**
   *
   * @Description: 拦截器
   * @Author: Owen
   * @Date: 2019-07-01 18:46
   *
   */

  private initInterceptors() {
    // 添加请求拦截器
    axios.interceptors.request.use(config => {
      // 在发送请求之前做些什么
      return config
    }, error => {
      // 对请求错误做些什么
      return Promise.reject(error)
    })

    // 添加响应拦截器
    axios.interceptors.response.use(response => {
      // 对响应数据做点什么
      return response
    }, error => {
      // 对响应错误做点什么
      return Promise.reject(error.response || {})
    })
  }

  /**
   *
   * @description: 转换 baseUrl
   * @param {config} 基本配置
   * @return {}
   *
   */

  private transformBaseUrl(config: BaseConfig): string {
    let {domain, prefix} = config

    domain = domain.replace(/\/^/, '') + '/'
    if (prefix) {
      prefix = prefix.replace(/\//g, '') + '/'
    }

    return domain + prefix
  }
}
