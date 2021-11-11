import applyNode from "./apply"
import taskNode from "./task"
import startNode from "./start"
import endNode from "./end"
import exclusiveGateway from "./exclusive-gateway"

const obj = {
  applyNode,
  taskNode,
  startNode,
  endNode,
  exclusiveGateway,
}

export default function (G6) {
  Object.values(obj).map((item) => {
    G6.registerNode(item.name, item.options, item.extendName)
  })
}
