import Vue from 'vue'
import Vuex from 'vuex'
import im from './im'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules:{
    im
  },
  state: {
    // host: "https://webtest.ouidating.com/",
    // host: "http://192.168.1.156:8080/",
    host: "https://pcweb.ouimeet.com/",
    imageHost:"https://img.lol99.com/",
    userInfo:{},
    lang:"en",
    photoList:[],
    defaultImg: "this.src='../../../static/img/cover.jpg'",
    defaultAvatar: "this.src='../../../static/img/avatar.png'"
  },
  mutations: {
    newUserInfo(state,value){
      state.userInfo=value;
    },
    newLang(state,value){
      state.lang = value;
    },
    newPhotoList(state,value){
      state.photoList=value;
    }
  },
  actions: {}
})

export default store
