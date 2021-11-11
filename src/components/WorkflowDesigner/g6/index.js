import G6 from "@antv/g6"
import registerNode from "./node/index"
import registerBehavior from "./behavior/index"
import registerEdge from "./edge/index"

registerNode(G6)
registerEdge(G6)
registerBehavior(G6)

export default G6
