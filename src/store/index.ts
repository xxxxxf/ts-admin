/**
 *
 * @Description: 初始化 Vuex
 * @Author: Owen
 * @Date: 2019-06-11 16:44
 *
 */

import Vue from 'vue'
import Vuex from 'vuex'

import state from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'
import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules
})
