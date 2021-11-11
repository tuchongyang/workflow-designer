<template>
  <div class="sketchpad-box">
    <div class="sketchpad" id="sketchpad"></div>
  </div>
</template>

<script>
export default {
  name: "SketchpadBox",
}
</script>

<style scoped lang="less">
.sketchpad-box {
  position: absolute;
  left: 250px;
  right: 10px;
  top: 60px;
  bottom: 10px;

  .sketchpad {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 10;
    background: @container-bg;
    border: 1px solid @color-border;
  }
  .inputBox {
    display: none;
  }
}
</style>
