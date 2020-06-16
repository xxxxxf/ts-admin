/**
 *
 * @Description: 全局的基础配置文件
 * @Author: Owen
 * @Date: 2019-06-11 16:49
 *
 */

import development from './development'
import test from './test'
import production from './production'

let domain: string
let client_id: number
let client_secret: string
let config: any

const prefix: string = '/'
const title: string = '电商平台'
const grant_type: string = "password"
const scope: string = "*"


// 开发环境
if (process.env.NODE_ENV === 'development') {
  config = development()
} else {
  if (process.env.VUE_APP_TITLE === 'test') {
    // 测试环境
    config = test()
  } else {
    // 生产环境
    config = production()
  }
}

domain = config.domain
client_id = config.client_id
client_secret = config.client_secret

export {
  domain,
  prefix,
  title,
  client_id,
  client_secret,
  grant_type,
  scope
}
