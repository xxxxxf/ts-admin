/**
 *
 * @Description: test 模块
 * @Author: Owen
 * @Date: 2019-06-11 17:51
 *
 */

import { TestStateType } from '@/types/store/test.type'

const state: TestStateType = {
  testMessage: 'this is a test message !'
}

const getters = {
  getTestMessage(state: TestStateType, getters: any, rootState: any, rootGetters: any) {
    return state.testMessage
  }
}

const mutations = {
  setTestMessage(state: TestStateType, value: string) {
    state.testMessage = value
  }
}

const actions = {

}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

