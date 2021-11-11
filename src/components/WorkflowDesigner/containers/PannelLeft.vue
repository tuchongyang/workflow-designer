<template>
  <div class="panel-left">
    <CardBox title="基础节点">
      <NodeElements :materials="materials" />
    </CardBox>
    <CardBox title="导航器">
      <div id="minimap"></div>
    </CardBox>
  </div>
</template>
<script setup>
import CardBox from "../components/CardBox.vue"
import NodeElements from "../components/NodeElements.vue"
import materials from "../config/materials"
</script>
<style scoped lang="less">
.panel-left {
  position: absolute;
  top: 50px;
  left: 0;
  bottom: 0;
  width: 240px;
  background: @container-bg;
  display: flex;
  flex-direction: column;
  padding: 10px 0 0 10px;
  box-sizing: border-box;
  .card-box {
  }
  #minimap {
    height: 300px;
  }
}
</style>
