import { defineStore } from 'pinia'

//组合式写法,需要自己写reset方法
export const useCounterStore = defineStore('counter', () => {
    //state
    const count = ref(0)
    //getter
    const doubleCount = computed(() => count.value * 2)
    //action
    function increment() {
        count.value++
    }
    function reset() {
        count.value = 0;
    }
    return { count, doubleCount, increment, reset }
}, {
    persist: true,
})

//建议使用选项式写法，插件reset方法自动将state返回初始值,便于清除数据
// export const useCounterStore = defineStore('counter', {
//     state: () => ({ count: 0 }),
//     getters: {
//         doubleCount: (state) => state.count * 2,
//     },
//     actions: {
//         increment() {
//             this.count++
//         },
//     },
//     persist: true,
// });