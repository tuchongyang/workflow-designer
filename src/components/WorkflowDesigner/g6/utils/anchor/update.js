/**
 * @description     更新锚点
 * */
export default function (cfg, group) {
  let { anchorPoints, width, height, id } = cfg
  const shape = group.find((a) => a.attr("name", "base-shape"))
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
      // 锚点背景
      let anchorBgShape = group.findById(id + "_anchor_bg_" + i)
      // 锚点
      let anchorShape = group.findById(id + "_anchor_" + i)
      anchorBgShape.attr({
        x: anchorX,
        y: anchorY,
      })
      anchorShape.attr({
        x: anchorX,
        y: anchorY,
      })
    }
  }
}
