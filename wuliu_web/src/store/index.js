/**
 * Created by sandy on 2019/9/2
 */
import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex);

export default new Vuex.Store({
    // modules:{
    //
    // },
    state:{
        // username: localStorage.getItem('username'),
        control: null,
        variable: null,
        serial: null,
        p_name: null,
    
        refuse_path: null
    },
    mutations:{
        get_control(state,data){
            state.control = JSON.parse(localStorage.getItem('control'));
        },
        get_variable(state,data){
            state.variable = JSON.parse(localStorage.getItem('variable'));
        },
        get_serial(state,data){
            state.serial = JSON.parse(localStorage.getItem('serial'));
        },
        get_p_name(state,data){
            state.p_name = localStorage.getItem('p_name');
        },
        get_refuse_path(state,data){
            state.refuse_path = localStorage.getItem('refuse_path');
        }
    },
    actions:{
        action_get_control({ commit },data){
            commit("get_control",data)
        },
        action_get_variable({ commit },data){
            commit("get_variable",data)
        },
        action_get_serial({ commit },data){
            commit("get_serial",data)
        }
        
        // async actionA ({ commit }) {
        //     commit('gotData', await getData())
        // },
        // async actionB ({ dispatch, commit }) {
        //     await dispatch('actionA') // 等待 actionA 完成
        //     commit('gotOtherData', await getOtherData())
        // }
    }
});