/**
 *
 * @Description: 校验必填字段类
 * @Author: Owen
 * @Date: 2019-07-03 00:59
 *
 */

import { isObject } from '@/utils/utils'

class CheckRequired {
  Message: any

  constructor() {
    this.Message = window.$message
  }

  /**
   *
   * @description: 类型校验
   * @param {source} 数据源
   * @param {rules} 规则
   * @return {string | undefined}
   *
   */

  public check(source: any, rules: any): string | undefined {
    if (isObject(source)) {
      return this.handleObjctType(source, rules)
    }

    return this.handleArrayType(source, rules)
  }

  /**
   *
   * @description: 处理对象类型
   * @param {source} 数据源
   * @param {rules} 规则
   * @return {string | undefined}
   *
   */

  private handleObjctType(source: any, rules: any): string | undefined {
    const message: string | undefined = this.checkProcess(source, rules)

    if (message) {
      return message
    }
  }

  /**
   *
   * @description: 处理数组类型
   * @param {source} 数据源
   * @param {rules} 规则
   * @return {string | undefined}
   *
   */

  private handleArrayType(source: any, rules: any): string | undefined {
    for (let i = 0; i < source.length; i++) {
      const message: string | undefined = this.checkProcess(source[i], rules)

      if (message) {
        return message
      }
    }
  }

  /**
   *
   * @description: 校验过程函数
   * @param {source} 数据源
   * @param {rules} 规则
   * @return {string | undefined}
   *
   */

  private checkProcess(source: any, rules: any): string | undefined {
    for (const key in rules) {
      const rulesItem = rules[key]
      const sourceItem = source[key]

      if (
        (rulesItem.type === 'number' ||
          rulesItem.type === 'string') &&
        rulesItem.value.includes(sourceItem)
      ) {
        return rulesItem.message
      }

      if (rulesItem.type === 'object') {
        const message: string | undefined = this.handleObjctType(sourceItem, rulesItem.atter)

        if (message) {
          return message
        }
      }

      if (rulesItem.type === 'array') {
        const message: string | undefined = this.handleArrayType(sourceItem, rulesItem.atter)

        if (message) {
          return message
        }
      }
    }
  }
}

function create() {
  const checkRequired = new CheckRequired()

  return checkRequired
}

export default create

