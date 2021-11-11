/**
 * 绘制锚点
 */

import config from "../../config"

export default function (cfg, group) {
  const { anchorPoints, width, height, id } = cfg
  // const shape = group.getFirst()
  const shape = group.find((a) => a.attr("name", "base-shape"))
  // console.log('getAnchorPoints', id, shape, anchorPoints.length)
  if (anchorPoints && anchorPoints.length) {
    for (let i = 0, len = anchorPoints.length; i < len; i++) {
      let anchorX
      let anchorY
      if (shape && shape.get("type") === "path") {
        const point = shape.getPoint(i / len)
        anchorX = point.x
        anchorY = point.y
      } else {
        const [x, y] = anchorPoints[i]
        // 计算Marker中心点坐标
        const originX = -width / 2
        const originY = -height / 2
        anchorX = x * width + originX
        anchorY = y * height + originY
      }
      // 添加锚点背景
      const anchorBgShape = group.addShape("marker", {
        id: id + "_anchor_bg_" + i,
        name: "anchorBg",
        attrs: {
          boxName: "anchor",
          name: "anchorBg",
          x: anchorX,
          y: anchorY,
          // 锚点默认样式
          ...config.anchorBg.style.default,
        },
        zIndex: 100,
      })
      // 添加锚点Marker形状
      const anchorShape = group.addShape("marker", {
        id: id + "_anchor_" + i,
        name: "anchorPoint",
        attrs: {
          boxName: "anchor",
          name: "anchorPoint",
          x: anchorX,
          y: anchorY,
          // 锚点默认样式
          ...config.anchor.style.default,
        },
      })
      if (anchorShape) {
        anchorShape.on("mouseenter", function () {
          anchorBgShape.attr({
            ...config.anchorBg.style.active,
          })
        })
        anchorShape.on("mouseleave", function () {
          anchorBgShape.attr({
            ...config.anchorBg.style.inactive,
          })
        })
      }
    }
  }
}
