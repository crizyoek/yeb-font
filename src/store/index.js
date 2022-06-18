import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    routes: []
  },

  // 改变state数据 同步改变
  mutations: {
    initRoutes(state, data) {
      state.routes = data
    }
  },

  //异步改变
  actions: {}

})
