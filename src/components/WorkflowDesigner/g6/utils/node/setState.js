/**
 * @description     设置节点状态
 * */

// import config from '../../config'

export default function (name, value, item) {
  let group = item.getContainer()
  let children = group.get("children")
  let line = children && children[0]
  if (!line) return
  if (name === "active") {
    for (let i = 0, len = children.length; i < len; i++) {
      let child = children[i]
      if (child.cfg && child.cfg["name"] == "outline") {
        // 处理线条状态
        if (value) {
          child.attr({ opacity: 1 })
          // 绘制边动画
          // drawEdgeAnimate(item.getModel(), item.getContainer())
        } else {
          child.attr({ opacity: 0 })
          // 销毁边动画
          // destroyEdgeAnimate(item.getModel(), item.getContainer())
        }
      }
    }
  }
  // if (name === 'hover') {
  //     if (value) {
  //         line.attr(config.node.style.active)
  //         // 绘制边动画
  //         // drawEdgeAnimate(item.getModel(), item.getContainer())
  //     } else if (!item.hasState('active')) {
  //         line.attr(config.node.style.inactive)
  //         // 销毁边动画
  //         // destroyEdgeAnimate(item.getModel(), item.getContainer())
  //     }

  // }
}
