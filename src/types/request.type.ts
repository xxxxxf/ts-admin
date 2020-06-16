/**
 *
 * @Description: 网络请求的参数类型控制
 * @Author: Owen
 * @Date: 2019-06-11 16:43
 *
 */

export interface BaseConfig {
  domain: string
  prefix: string
  timeout: number
}

export interface RequestConfig {
  method?: string
  url?: string
  query?: any
  body?: any
  isLoading?: boolean
  isToken?: boolean
  isExportFail?: boolean
}

export interface Axios {
  request(requestConfig: RequestConfig): Promise<any>

  get(url: string, requestConfig?: RequestConfig): Promise<any>

  head(url: string, requestConfig?: RequestConfig): Promise<any>

  delete(url: string, requestConfig?: RequestConfig): Promise<any>

  options(url: string, requestConfig?: RequestConfig): Promise<any>

  post(url: string, requestConfig?: RequestConfig): Promise<any>

  put(url: string, requestConfig?: RequestConfig): Promise<any>

  patch(url: string, requestConfig?: RequestConfig): Promise<any>
}

export interface Instance extends Axios {
  (requestConfig: RequestConfig): Promise<any>
}
