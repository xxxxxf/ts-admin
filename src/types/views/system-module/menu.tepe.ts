/**
 *
 * @Description: 菜单管理的接口
 * @Author: Owen
 * @Date: 2019-07-03 14:19
 *
 */

export interface SeqType {
  id: number
  seq: number
}

export interface AddSource {
  id: number
  menu_id?: number
  name: string
  controller: string
  function: string
  auth_sign: string
}

export interface BasicType {
  label: string
  value: string | number
}
