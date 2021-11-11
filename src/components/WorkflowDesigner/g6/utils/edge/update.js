/**
 * @description     更新边
 * */

export default function (node, graph) {
  let edges = graph.getEdges()
  if (!edges || !edges.length) {
    return
  }
  let nodeModel = node.getModel()
  edges.forEach((edge) => {
    let edgeModel = edge.getModel()
    if (nodeModel.id === edgeModel.attrs.start) {
      let anchorPoint = edgeModel.source
      if (anchorPoint) {
        let nodeAnchor = node.getLinkPointByAnchor(anchorPoint.index)
        graph.updateItem(edge, {
          source: nodeAnchor,
        })
      }
    } else if (nodeModel.id === edgeModel.attrs.end) {
      let anchorPoint = edgeModel.target
      if (anchorPoint) {
        let nodeAnchor = node.getLinkPointByAnchor(anchorPoint.index)
        graph.updateItem(edge, {
          target: nodeAnchor,
        })
      }
    }
  })
}
