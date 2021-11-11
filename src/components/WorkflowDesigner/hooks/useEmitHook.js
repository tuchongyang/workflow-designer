export function useEmitHook(graph) {
  const editorAddNode = (node) => {
    // 广播事件，通过自定义交互 node-control 添加节点
    graph.emit("editor:addNode", node)
  }
  return {
    editorAddNode,
  }
}
