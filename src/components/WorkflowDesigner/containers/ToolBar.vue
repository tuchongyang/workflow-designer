<template>
  <div class="tool-bar">
    <div class="title">流程设计器</div>
  </div>
</template>
<style scoped lang="less">
.tool-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background: @container-bg;
  border-bottom: 1px solid @color-border;
  z-index: 50;
  .title {
    line-height: 50px;
    padding: 0 20px;
    letter-spacing: 2px;
  }
}
</style>
