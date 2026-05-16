// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import Meta from 'vue-meta';
Vue.use(Meta);

import axios from 'axios'


import { Message } from 'iview'

// axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.baseURL = process.env.API_ROOT;
// axios.defaults.baseURL = 'http://39.106.210.133:3000';
// 配置响应拦截器
// axios.defaults.headers.common['Authorization'] = "666";
axios.defaults.headers = {
    "Content-Type": "application/json"
}
// 带cookie请求
axios.defaults.withCredentials = true


console.log(123)





axios.interceptors.response.use(res => {
    console.log(res.data)
    if(res.data.RES != 'SUCCESS'){
        if(res.data.ERROR_MSG.CODE == -100){
            vm.$router.push(
                {
                    path:"/login",
                    params: {  }
                }
            )
        }else{
            Message.error(res.data.ERROR_MSG.MESSAGE);
        }
        // vm.$Modal.confirm({
        //     render: (h) => {
        //         return h('Input', {
        //             props: {
        //                 value: this.value,
        //                 autofocus: true,
        //                 placeholder: '登录超时,请输入登录密码'
        //             },
        //             on: {
        //                 input: (val) => {
        //                     console.log(val);
        //                     this.value = val;
        //                 }
        //             }
        //         })
        //     }
        // })
        return "";
    }else{
        return Promise.resolve(res.data);
    };
   
}, error => {
    Message.error("网络异常")
    return Promise.reject(error);
})

Vue.prototype.Ajax = axios;



Vue.config.productionTip = false;

import moment from "moment";
Vue.prototype.moment = moment;



import 'iview/dist/styles/iview.css';


import store from './store'
import Router from "vue-router";
/* eslint-disable no-new */
var vm = new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
