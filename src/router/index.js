import Vue from 'vue';
import VueRouter from 'vue-router';

// 使用VueRouter统一管理应用路由
Vue.use(VueRouter);

export default new VueRouter({
    routes: [
        {
            path: '/',
            redirect: '/diff'
        },
        {
            path: '/diff',
            name: 'diff',
            component: () => import('../modules/diff/index.vue')
        }
    ]
});
