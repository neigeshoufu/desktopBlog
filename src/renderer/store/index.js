import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'




import { createPersistedState, createSharedMutations } from 'vuex-electron'

import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  state:{
   list:[
    {"name": "Toms'blog", "address": "https://tomassky.github.io/"},
    {"name": "Daniel'blog", "address": "https://neigeshoufu.github.io/mydoc/#/"}
   ],
   drawer: false,
   webviewAdd: ''
  },
  mutations: {
    updateList(state, val) {
      state.list.push(val)
      //state.list.shift()
      console.log(state.list)
    },
    drawerControl(state, flag) {
      state.drawer = flag
    },
    changeView(state, add) {
      state.webviewAdd = add
    },
    deleteList(state, index) {
      state.list.splice(index, 1)
    }
  },
  actions: { //异步操作
   getList(context) {
     
   }
  },
  getters: {
    
  },
  modules,
  plugins: [
    createPersistedState(),
    ///createSharedMutations()
    //此行注释掉之后可以使用this.$store.commit()
  ],
  strict: process.env.NODE_ENV !== 'production'
})
