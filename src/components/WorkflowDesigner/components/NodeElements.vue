<template>
  <div class="node-elements">
    <div class="item" v-for="(info, i) in props.materials" :key="i" @mousedown="onMousedown" :data-info="info.label + '|' + info.icon" :data-index="i">
      <img class="icon" :src="info.icon" v-if="info.icon" />
      <span class="txt">{{ info.label }}</span>
    </div>
  </div>
</template>
<script setup>
import { defineProps } from "vue"
import * as Utils from "../utils"
const props = defineProps({
  materials: {
    type: Array,
    default() {
      return []
    },
  },
})
const dragEvent = {
  startX: 0,
  startY: 0,
  moveable: false,
  cloneEle: null,
  moduleType: "",
  isIn: false,
}
const getCloneEle = (e) => {
  var info = e.target.getAttribute("data-info")
  var infos = info.split("|")
  var div = document.createElement("div")
  var position = Utils.getPosition(e.target)
  div.setAttribute(
    `style`,
    `width:65px;height:65px;border-radius:3px;position:absolute;z-index:90;padding:5px 0;text-align:center;font-size:12px;color: #a6a6a6;opacity: .8;box-shadow: 0 0 5px rgba(0,0,0,.3);cursor:pointer;box-sizing:border-box;padding-bottom:5px;top:${position.top}px;left:${position.left}px`
  )
  div.innerHTML = `<div class="icon" style="display:inline-block;line-height:1;vertical-align:top; margin: 0 0 5px;"><img src="${infos[1]}" style="vertical-align:top;" width="32" height="30"></div><div class="name">${infos[0]}</div>`
  document.body.appendChild(div)
  dragEvent.startL = position.left
  dragEvent.startT = position.top
  dragEvent.moduleType = infos[2]
  dragEvent.index = e.target.getAttribute("data-index")
  return div
}
const onMousedown = (e) => {
  dragEvent.startX = e.pageX
  dragEvent.startY = e.pageY
  dragEvent.cloneEle = getCloneEle(e)

  document.addEventListener("mousemove", _onMousemove)
  document.addEventListener("mouseup", _onMouseup)
}
const _onMousemove = (e) => {
  e.preventDefault()
  dragEvent.cloneEle.style.left = dragEvent.startL + e.pageX - dragEvent.startX + "px"
  dragEvent.cloneEle.style.top = dragEvent.startT + e.pageY - dragEvent.startY + "px"

  dragEvent.endX = e.pageX
  dragEvent.endY = e.pageY
}
const _onMouseup = () => {
  document.removeEventListener("mousemove", _onMousemove)
  document.removeEventListener("mouseup", _onMouseup)
  document.body.removeChild(dragEvent.cloneEle)
  var box = document.querySelector("#sketchpad")
  var position = Utils.getPosition(box)
  if (dragEvent.endX > position.left && dragEvent.endX < position.left + box.offsetWidth && dragEvent.endY > position.top && dragEvent.endY < position.top + box.offsetHeight) {
    var current = props.materials[dragEvent.index]
    var a = { ...current }
    a.x = dragEvent.endX - position.left
    a.y = dragEvent.endY - position.top
    Utils.bus.emit("editor/add/node", Utils.deepClone(a))
  }
}
</script>
<style lang="less" scoped>
.node-elements {
  padding: 5px;
  .item {
    width: 65px;
    height: 65px;
    float: left;
    text-align: center;
    font-size: 12px;
    cursor: pointer;
    padding: 5px 0;
    box-sizing: border-box;
    & > * {
      pointer-events: none;
    }
    &:hover {
      background: #fafafa;
    }
    .icon {
      width: 32px;
      height: 30px;
      display: inline-block;
      line-height: 1;
      vertical-align: top;
      margin-bottom: 5px;
    }
    .txt {
      display: block;
    }
  }
  .clearfix;
}
</style>
