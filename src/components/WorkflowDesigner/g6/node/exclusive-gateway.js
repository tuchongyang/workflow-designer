import base from "./base"
import utils from "../utils"

export default {
  name: "exclusiveGateway",
  extendName: "single-shape",
  options: {
    ...base,
    shapeType: "path",
    getShapeStyle(cfg) {
      const size = this.getSize(cfg)
      const width = size[0]
      const height = size[1]
      const x = 0 - width / 2
      const y = 0 - height / 2
      const gap = 0
      const path = [
        ["M", 0 - gap, 0 - height / 2 + gap],
        ["Q", 0, 0 - height / 2, gap, 0 - height / 2 + gap],
        ["L", width / 2 - gap, 0 - gap],
        ["Q", width / 2, 0, width / 2 - gap, gap],
        ["L", gap, height / 2 - gap],
        ["Q", 0, height / 2, 0 - gap, height / 2 - gap],
        ["L", -width / 2 + gap, gap],
        ["Q", -width / 2, 0, -width / 2 + gap, 0 - gap],
        ["Z"],
      ]
      const color = cfg.color
      const style = Object.assign(
        {
          // 节点的位置在上层确定，所以这里仅使用相对位置即可
          x,
          y,
          width,
          height,
          path,
          stroke: color,
        },
        cfg.style
      )
      return style
    },
    afterDraw(cfg, group) {
      group.icon = group.addShape("path", {
        attrs: {
          path: [["M", -8, -8], ["L", 8, 8], ["Z"], ["M", 8, -8], ["L", -8, 8], ["Z"]],
          lineWidth: 2,
          fill: "#1ac4c4",
          stroke: "#1ac4c4",
        },
      })
      this.addEmpty(cfg, group)
      // 绘制锚点
      utils.anchor.draw(cfg, group)
      // 绘制shapeControl
      utils.shapeControl.draw(cfg, group)
    },
  },
}
