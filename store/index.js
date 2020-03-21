import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'

Vue.use(Vuex)

const state = {
  colorTheme: 'greenUp',
  upTheme: {txt: '#39b54a', bg: '#d7f0db'},
  downTheme: {txt: '#e54d42', bg: '#fadbd9'},
  pricePosition: 'CNYUP',
  userId: null,
  frontImg: null,
  backImg: null
}

export default new Vuex.Store({
  state,
  mutations
})
