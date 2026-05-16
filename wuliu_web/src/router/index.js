import Vue from 'vue'
import Router from 'vue-router'

import iView from 'iview';




Vue.use(Router)
Vue.use(iView);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/index'
        },
        {
            path: '/user_info',
            component: require('@/components/user/user_info.vue').default,
            meta: ["个人中心"]
        },
        {
            name:"quotationDetailPrev",
            path: '/quotationDetailPrev',
            component: require('@/components/quotationList/detail_prev.vue').default,
            meta: {
                title: 'quotation prev',
                keepAlive: true
            }
        },
        {
            name:"quotationDetail",
            path: '/quotationDetail',
            component: require('@/components/quotationList/detail.vue').default,
            meta: {
                title: 'quotation',
                keepAlive: true
            }
        },
        {
            name:"index",
            path: '/index',
            component: require('@/components/index.vue').default,
            children: [
                {
                    path: '/',
                    redirect: '/list'
                },
                {
                    name:"list",
                    path: '/list',
                    component: require('@/components/order/list.vue').default,
                    meta: {
                        title: '订单列表',
                        keepAlive: true
                    }
                },
                {
                    name:"detail",
                    path: '/detail',
                    component: require('@/components/order/detail.vue').default,
                    meta: ["订单详情"]
                },
                {
                    name:"use_list",
                    path: '/use_list',
                    component: require('@/components/order/use_list.vue').default,
                    meta: ["用户管理"]
                },
                {
                    name:"quotation_list",
                    path: '/quotation_list',
                    component: require('@/components/quotationList/index.vue').default,
                    meta: {
                        title: 'quotation',
                        keepAlive: true
                    }
                },
            ]
        },
        {
            path: '/login',
            component: require('@/components/user/login.vue').default,
            meta: ["登录页"]
        },
        {
            name: 'register',
            path: '/register',
            component: require('@/components/user/register.vue').default,
            meta: ["注册页"]
        }
    ]
})
