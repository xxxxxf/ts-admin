/**
 *
 * @Description: 网络请求
 * @Author: Owen
 * @Date: 2019-06-11 16:42
 *
 */

import Axios from './axios'
import { BaseConfig, Instance } from '@/types/request.type'
import { extend } from '@/utils/utils'

function create(config: BaseConfig): Instance {
  const context = new Axios(config)
  const instance = Axios.prototype.request.bind(context)
  let enumResult: string[] = Object.getOwnPropertyNames(Axios.prototype)

  enumResult = enumResult.filter(item => !['constructor'].includes(item))

  extend(instance, context, enumResult)

  return instance as Instance
}

export default create
