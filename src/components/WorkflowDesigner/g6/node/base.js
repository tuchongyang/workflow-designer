import utils from "../utils"

export default {
  shape: null,
  drawShape(cfg, group) {
    const shapeType = this.shapeType
    const style = this.getShapeStyle(cfg)
    const shape = group.addShape(shapeType, {
      attrs: style,
      name: "base-shape",
    })
    this.shape = shape
    return shape
  },
  getAnchorPoints(cfg) {
    const { anchorPoints, width, height } = cfg
    const shape = this.shape
    let points = []
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

        // 方式一：通过坐标反推占比
        let x = anchorX
        let y = anchorY
        // 坐标系转换
        let x1 = width / 2 + x
        let y1 = height / 2 + y
        // 百分比
        let px = x1 / width
        let py = y1 / height
        points.push([px, py])
      }
    }
    return points
  },
  setState(name, value, item) {
    // 设置锚点状态
    utils.anchor.setState(name, value, item)
    // 设置shapeControl状态
    utils.shapeControl.setState(name, value, item)
  },
  addEmpty(cfg, group) {
    //加入一个空白的层，解决拖拽失灵问题
    const w = cfg.size[0],
      h = cfg.size[1]
    group.addShape("rect", {
      attrs: {
        fill: "rgba(240,240,240,.1)",
        x: 0 - w / 2,
        y: 0 - h / 2,
        width: w,
        height: h,
        opacity: 0,
        stroke: "#409EFF",
      },
      name: "empty",
    })
  },
  // 绘制后附加锚点
  afterDraw(cfg, group) {
    this.addEmpty(cfg, group)
    // 绘制锚点
    utils.anchor.draw(cfg, group)
    // 绘制shapeControl
    utils.shapeControl.draw(cfg, group)
  },
  // 更新完成后更新锚点
  afterUpdate(cfg, item) {
    const group = item.getContainer()
    // 更新锚点
    utils.anchor.update(cfg, group)
    // 更新shapeControl
    utils.shapeControl.update(cfg, group)
  },
  update(cfg, item) {
    // 自定义节点配置
    const defaultStyle = this.options
    // 从新计算图形样式
    const shapeStyle = this.getShapeStyle(cfg)
    const style = Object.assign(defaultStyle, shapeStyle)
    // 更新图形
    this.updateShape(cfg, item, style)
  },
  updateShape(cfg, item, style) {
    const keyShape = item.get("keyShape")
    keyShape.attr({
      ...style,
    })
    // 更新图形文本
    this.updateLabel(cfg, item)

    let group = item.getContainer()
    let children = group.get("children")
    const w = cfg.size[0],
      h = cfg.size[1]
    for (let i = 0; i < children.length; i++) {
      var name = children[i].cfg["name"]
      if (["empty"].indexOf(name) > -1) {
        children[i].attr({ width: w, height: h, x: -w / 2, y: -h / 2 })
      }
    }
  },
}
