/**
 *
 * @Description: 主入口
 * @Author: Owen
 * @Date: 2019-06-11 17:53
 *
 */

import Vue from 'vue'
import axios from 'axios'

import store from './store'
import router from './router'
import '@/router/handleRouter'
import './useComponents'
import './usePlugin'

import App from './App.vue'
import '@/assets/iconfont/iconfont.css'
const trigger = (el: any, type: any) => {
  const e = document.createEvent('HTMLEvents')
  e.initEvent(type, true, true)
  el.dispatchEvent(e)
}
// 清楚空格
Vue.directive('enterBlank', {inserted(el: any) {
    const ele = el.tagName === 'INPUT' ? el : el.querySelector('input')
    ele.onkeyup = () => {
      let val = ele.value
      val = val.replace(/\s+/g, '')
      ele.value = val
      trigger(ele, 'input')
    }
    ele.onblur = () => {
      let val = ele.value
      val = val.replace(/\s+/g, '')
      ele.value = val
      trigger(ele, 'input')
    }
  }
})
Vue.prototype.$ajax = axios
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
