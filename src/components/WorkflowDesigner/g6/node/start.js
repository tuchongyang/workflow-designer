import base from "./base"

export default {
  name: "start",
  extendName: "single-shape",
  options: {
    ...base,
    shapeType: "circle",
    getShapeStyle(cfg) {
      console.log(cfg)
      const size = this.getSize(cfg)
      const width = size[0]
      const height = size[1]
      const x = 0
      const y = 0
      var r = width / 2
      const color = cfg.color
      const style = Object.assign(
        {
          // 节点的位置在上层确定，所以这里仅使用相对位置即可
          x,
          y,
          width,
          height,
          r,
          stroke: color,
        },
        cfg.style
      )
      return style
    },
  },
}
