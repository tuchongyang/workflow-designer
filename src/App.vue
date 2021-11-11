<template>
  <div class="container">
    <WorkflowDesigner />
  </div>
</template>
<script setup>
import WorkflowDesigner from "@/components/WorkflowDesigner/workflow-designer.vue"
</script>
<style lang="less">
body {
  margin: 0;
  padding: 0;
}
.container {
  width: 100%;
  height: 100vh;
}
</style>
