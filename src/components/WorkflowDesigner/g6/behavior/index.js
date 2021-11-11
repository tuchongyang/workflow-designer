// 综合节点控制交互
import nodeControl from "./nodeControl"

const obj = {
  nodeControl,
}

export default function (G6) {
  Object.values(obj).map((item) => {
    G6.registerBehavior(item.name, item.options)
  })
}
