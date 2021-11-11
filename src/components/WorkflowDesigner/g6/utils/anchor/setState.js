/**
 * @description     设置锚点状态
 *
 * */

import config from "../../config"

export default function (name, value, item) {
  if (name === "hover" || name == "selected") {
    let group = item.getContainer()
    let children = group.get("children") || []
    for (let i = 0, len = children.length; i < len; i++) {
      let child = children[i]
      if (child.attrs && child.attr("name")) {
        switch (child.attr("name")) {
          case "anchorPoint":
            if (value) {
              child.show()
              child.attr(config.anchor.style.hover)
            } else {
              child.attr(config.anchor.style.unhover)
              child.hide()
            }
            break
        }
      }
    }
  }
}
