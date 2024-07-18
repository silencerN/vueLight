//import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/router.js'
import { createPinia } from 'pinia'
import store from '@/store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/styles/index.scss'

const app = createApp(App);
//初始化pania
const pinia = createPinia();
//使用pinia持久化储存
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
pinia.use(piniaPluginPersistedstate);//单独配置某个store持久化

//全局默认所有strore持久化
// import { createPersistedState } from 'pinia-plugin-persistedstate'
// pinia.use(createPersistedState({auto: true,}));
app.use(pinia);
//全部store挂载到实例上
app.config.globalProperties.$store = store;
app.use(router);
//配置全局api
import api from '@/api'
app.config.globalProperties.$api = api;
//配置全局组件
import globalComponents from '@/components/index'
Object.keys(globalComponents).forEach((key) => {
    app.component(key, globalComponents[key])
});

//混合组件公共属性和方法(vue3不推荐，后续会用Composition API改造)
import mixin from '@/utils/mixin'
app.mixin(mixin)

// 国际化
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
app.use(ElementPlus, {
    locale: zhCn,
});
// 注册所有图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}
app.mount('#app');
