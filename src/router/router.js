import { createWebHistory, createRouter } from 'vue-router'

import HelloWorld from '../views/HelloWorld.vue'
import About from '../views/About.vue'
import NotFound from '../views/404NotFound.vue'

const routes = [
    { path: '/', component: HelloWorld },
    { path: '/about', component: About },
    {
        path: '/404',
        name: '404page',
        component: NotFound,
    },
    //404重定向路由，放在最后
    {
        path: '/:pathMatch(.*)',
        redirect: '/404',
        hidden: true
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})
export default router;