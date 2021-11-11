<template>
  <div class="card-box">
    <div class="head">{{ props.title }}</div>
    <div class="body"><slot></slot></div>
  </div>
</template>
<script setup>
import { defineProps } from "vue"
const props = defineProps({
  title: String,
})
</script>
<style lang="less" scoped>
.card-box {
  height: 100%;
  border: 1px solid @color-border;
  margin-bottom: 10px;
  position: relative;
  .head {
    height: 40px;
    line-height: 40px;
    padding: 0 15px;
    border-bottom: 1px solid @color-border;
  }
  .body {
    position: absolute;
    top: 40px;
    bottom: 0;
    width: 100%;
    overflow: auto;
  }
}
</style>
