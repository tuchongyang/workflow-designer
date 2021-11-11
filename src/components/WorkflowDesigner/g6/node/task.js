import base from "./base"

export default {
  name: "task",
  extendName: "single-shape",
  options: {
    ...base,
    shapeType: "path",
    drawShape(cfg, group) {
      const shapeType = this.shapeType
      const style = this.getShapeStyle(cfg)
      const shape = group.addShape(shapeType, {
        attrs: style,
      })
      this.shape = shape
      return shape
    },
    getShapeStyle(cfg) {
      const size = this.getSize(cfg)
      const width = size[0]
      const height = size[1]
      const x = 0 - width / 2
      const y = 0 - height / 2
      const path = [
        // 左顶点
        ["M", -width / 2, 0],
        // 左上顶点
        ["L", -width / 2, -height / 2],
        // 右上顶点
        ["L", width / 2, -height / 2],
        // 右下顶点
        ["L", width / 2, height / 2],
        // 左下顶点
        ["L", -width / 2, height / 2],
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
  },
}
