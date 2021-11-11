<template>
  <div class="wd-container">
    <ToolBar />
    <PannelLeft />
    <SketchpadBox />
  </div>
</template>
<script setup>
import { onMounted } from "vue"
import ToolBar from "./containers/ToolBar.vue"
import PannelLeft from "./containers/PannelLeft.vue"
import SketchpadBox from "./containers/SketchpadBox.vue"
import { useGraphHook } from "./hooks/useGraphHook"
import { useEmitHook } from "./hooks/useEmitHook"
import * as Utils from "./utils"

onMounted(() => {
  const graph = useGraphHook()
  const { editorAddNode } = useEmitHook(graph)
  Utils.bus.on("editor/add/node", editorAddNode)
})
</script>
<style scoped>
.wd-container {
  width: 100%;
  height: 100%;
  position: relative;
  font-size: 14px;
}
</style>
