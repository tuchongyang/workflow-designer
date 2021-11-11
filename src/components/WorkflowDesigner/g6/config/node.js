/**
 *
 * 节点配置
 */

export default {
  style: {
    default: {
      stroke: "#000000",
      strokeOpacity: 1,
    },
    active: {
      shadowColor: "#a6e9f3",
      shadowBlur: 2,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
    },
    inactive: {
      shadowColor: "",
    },
    hovered: {
      fill: "#f2fcfd",
    },
    inhovered: {
      fill: "rgba(255,255,255,.7)",
    },
  },
  type: {
    solid: {
      lineDash: [],
    },
    dashed: {
      lineDash: [5, 5],
    },
    dot: {
      lineDash: [2, 2],
    },
  },
}
