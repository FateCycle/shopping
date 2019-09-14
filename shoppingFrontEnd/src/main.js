// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import Vuex from 'vuex';
import {currency} from './assets/js/currency'
Vue.config.productionTip = false


Vue.use(infiniteScroll);

Vue.use(Vuex);

Vue.filter("currency",currency);

Vue.use(VueLazyLoad,{
  loading:'/static/loading-bars.svg'  
})


const store=new Vuex.Store({
  state:{
    nickname:'',
    cartCount:0,
  },
  mutations:{
    updateUserInfo(state,nickname){
      state.nickname=nickname;
    },
    updateCartCount(state,cartCount){
      state.cartCount+=cartCount
    },
    initCartCount(state,cartCount){
      state.cartCount=cartCount;
    }
  }

})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
