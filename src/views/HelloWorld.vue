<script setup>
const { proxy } = getCurrentInstance();
let countStore = proxy.$store.counter.useCounterStore();
//let { count } = toRefs(countStore); //state需要toRefs转化再解构
//let { increment, reset } = countStore; //action可以直接解构

const openmsg = () => {
  countStore.reset();
  ElMessage({ type: "success", message: "清除持久化数据成功" });
};
const testapi = async () => {
  let res = await proxy.$api.test.testapi();
  proxy.submitOk(res);
};
</script>

<template>
  <h1>this is Index</h1>
  <el-divider />
  <button type="button" @click="countStore.increment">count is {{ countStore.count }}</button>
  <el-button type="success" @click="openmsg">清除持久化数据</el-button>
  <el-divider />

  <el-button type="success" @click="testapi">测试api</el-button>
  <el-divider />
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>人员列表</span>
        <el-button class="button" text>Operation button</el-button>
      </div>
    </template>
    <div v-for="o in actorList" :key="o.name" class="text item">{{ o.name + " " + o.value }}</div>
  </el-card>
  <el-divider />
</template>

<style lang="scss" scoped>
.read-the-docs {
  color: #888;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 480px;
}
</style>
