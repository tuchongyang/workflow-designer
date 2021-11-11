/**
 * @description     左侧节点数据仓库
 *
 * @author          重阳
 * */

// 锚点坐标
let anchorPoints = [
  [0, 0],
  [0.5, 0],
  [1, 0],
  [0.5, 1],
  [1, 1],
  [1, 0.5],
  [0, 0.5],
  [0, 1],
]
let model = function () {
  return {
    width: 100,
    height: 100,
    anchorPoints: anchorPoints,
  }
}
let nodes = [
  {
    type: "start",
    label: "开始",
    width: 40,
    height: 40,
    anchorPoints: anchorPoints,
    icon: require("@/assets/flow/start.svg"),
    style: {
      fill: "#fdf6e7",
      stroke: "#fbad5a",
    },
  },
  {
    type: "apply",
    label: "申请节点",
    width: 80,
    height: 40,
    anchorPoints: anchorPoints,
    icon: require("@/assets/flow/apply.svg"),
    style: {
      fill: "#e7feeb",
      stroke: "#9efeae",
    },
  },
  {
    type: "task",
    label: "审批节点",
    width: 80,
    height: 40,
    anchorPoints: anchorPoints,
    icon: require("@/assets/flow/task.svg"),
    style: {
      fill: "#e7f7fe",
      stroke: "#9ed2fe",
    },
  },
  {
    type: "exclusiveGateway",
    label: "排他网关",
    width: 40,
    height: 40,
    anchorPoints: anchorPoints,
    icon: require("@/assets/flow/exclusive-gateway.svg"),
    style: {
      fill: "#e8fefa",
      stroke: "#1ac4c4",
    },
    labelCfg: {
      style: {
        opacity: 0,
      },
    },
  },
  {
    type: "end",
    label: "结束",
    width: 40,
    height: 40,
    anchorPoints: anchorPoints,
    icon: require("@/assets/flow/end.svg"),
    style: {
      fill: "#fce6e9",
      stroke: "#f46369",
    },
  },
].map((item) => {
  return { ...new model(), ...item, size: [item.width, item.height] }
})

export default nodes
