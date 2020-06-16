/**
 *
 * @Description: 表头固定功能
 * @Author: Owen
 * @Date: 2019-07-04 15:05
 *
 */

import { Vue, Component } from 'vue-property-decorator'

import { addClass, hasClass, removeClass } from '@/utils/utils'

/**
 *
 * @description: 列表头部的宽度
 *
 */

let width: string | null

/**
 *
 * @description: 头部 dom
 *
 */

let headerEl: HTMLDivElement | null

/**
 *
 * @description: 列表标题 dom
 *
 */

let listHeaderEl: HTMLDivElement | null

/**
 *
 * @description: 列表头部 dom
 *
 */

let elTableHeaderEl: HTMLDivElement | null

/**
 *
 * @description: 滚动距离
 *
 */

let scrollTop: number | null = 0
let scrollLeft: number | null = 0

/**
 *
 * @description: 左, 上边距
 *
 */

const LEFT_OFFSET = 80
const TOP_OFFET = 130


@Component

export default class FixedTableHeader extends Vue {
  public created() {
    window.addEventListener('scroll', this.onScroll)
  }

  public mounted() {
    this.$nextTick(() => {
      headerEl = document.querySelector('.el-header')
      listHeaderEl = document.querySelector('.list-header')
      elTableHeaderEl = document.querySelector('.el-table__fixed-header-wrapper')
      width = ((elTableHeaderEl as HTMLDivElement).querySelector('.el-table__header') as HTMLDivElement).style.width || '0'
    })
  }

  /**
   *
   * @description: 滚动事件
   * @param {}
   * @return {}
   *
   */

  public onScroll() {
    let opacity: string
    let cssText: string
    let elCssText: string

    scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft

    if (scrollTop > TOP_OFFET) {
      opacity = '0'
      cssText = `width: ${ width };position: fixed; top: 0;left: ${ LEFT_OFFSET - scrollLeft }px;z-index: 100;`
      elCssText = `position: fixed; top: 60px;left: ${ LEFT_OFFSET - scrollLeft }px;z-index: 100;`;
      (elTableHeaderEl as HTMLDivElement).querySelectorAll('th').forEach((thEl, index) => {
        if (index < 2) {
          return
        }

        removeClass(thEl, 'is-hidden')
      })
    } else {
      opacity = '1'
      cssText = ''
      elCssText = '';
      (elTableHeaderEl as HTMLDivElement).querySelectorAll('th').forEach((thEl, index) => {
        if (index < 2) {
          return
        }

        if (!hasClass(thEl, 'is-hidden')) {
          addClass(thEl, 'is-hidden')
        }
      })
    }

    (headerEl as HTMLDivElement).style.opacity = opacity;
    (listHeaderEl as HTMLDivElement).style.cssText = cssText;
    (elTableHeaderEl as HTMLDivElement).style.cssText = elCssText
  }

  public beforeDestroy() {
    (headerEl as HTMLDivElement).style.opacity = '1';
    window.removeEventListener('scroll', this.onScroll)

    width = null
    headerEl = null
    listHeaderEl = null
    elTableHeaderEl = null
    scrollTop = null
    scrollLeft = null
  }
}
