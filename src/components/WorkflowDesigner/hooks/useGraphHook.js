import G6 from "../g6"
import config from "../g6/config"
import editorConfig from "../config"
export function useGraphHook(data) {
  // 画板
  let sketchpad = document.querySelector("#sketchpad")
  let minimapDom = document.querySelector("#minimap")
  const grid = new G6.Grid()
  const minimap = new G6.Minimap({
    container: minimapDom,
    size: [minimapDom.offsetWidth, minimapDom.offsetHeight],
  })
  // 生成编辑器实例
  const graph = new G6.Graph({
    plugins: [grid, minimap],
    container: sketchpad,
    width: sketchpad.clientWidth,
    height: sketchpad.clientHeight,
    fitViewPadding: 20,
    // fitView: true,
    autoPaint: true,
    groupByTypes: false,
    // 模式
    modes: {
      edit: [
        "zoom-canvas",
        "drag-canvas",
        // 'drag-node',
        // 'click-select',
        {
          type: "node-control",
          updateEdge: true,
          enableNodeLabel: true,
          enableEdgeLabel: true,
        },
      ],
      // 只读，
      preview: ["drag-canvas", "zoom-canvas"],
    },
  })
  graph.$X = editorConfig.$X
  graph.$C = { ...config }
  // 设置模式为编辑
  graph.setMode("edit")
  if (data) {
    graph.data(data)
    graph.render()
    setTimeout(() => {
      graph.getNodes().forEach((a) => {
        // if(a.getModel().type=='groupShape'){
        a.toFront()
        // }
        if (a.getModel().type == "groupShape") {
          a.toBack()
        }
      })
    })
  }

  window.addEventListener("resize", () => {
    setTimeout(() => {
      graph.changeSize(sketchpad.clientWidth, sketchpad.clientHeight)
    })
  })

  return graph
}
