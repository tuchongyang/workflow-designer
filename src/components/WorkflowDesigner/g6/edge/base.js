/**
 *
 * 线条公共方法
 */

import utils from "../utils"

export default {
  draw(cfg, group) {
    const { startPoint, endPoint } = cfg
    const keyShape = group.addShape("path", {
      className: "edge-shape",
      attrs: {
        ...cfg,
        path: [
          ["M", startPoint.x, startPoint.y],
          ["L", endPoint.x, endPoint.y],
        ],
      },
    })
    return keyShape
  },
  setState(name, value, item) {
    // 设置边状态
    utils.edge.setState(name, value, item)
  },
}
