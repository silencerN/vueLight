<script setup>
const { proxy } = getCurrentInstance();
let countStore = proxy.$store.counter.useCounterStore();
let { doubleCount } = toRefs(countStore);
</script>

<template>
  <h1>this is about,doubleCount is {{ doubleCount }}</h1>
  <p class="card-p">
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">create-vue</a>, the official Vue + Vite starter
  </p>
  <p>
    Learn more about IDE Support for Vue in the
    <a href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support" target="_blank">Vue Docs Scaling up Guide</a>.
  </p>
  <nodata>测试用全局组件</nodata>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
.card-p {
  color: rgb(255, 0, 85);
}
</style>
