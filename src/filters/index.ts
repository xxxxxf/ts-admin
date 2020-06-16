/**
 *
 * @Description: 全局过滤器
 * @Author: Owen
 * @Date: 2019-06-11 16:51
 *
 */

/**
 *
 * @description: 千位符 10000 => "10,000"
 * @param {number}
 * @return {string}
 *
 */

export function toThousandFilter(num: number): string {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}


