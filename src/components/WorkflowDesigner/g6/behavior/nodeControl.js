import config from "../config"
import utils from "../utils"
import * as Utils from "../../utils"
import * as G6DomUtil from "@antv/dom-util"
export default {
  name: "node-control",
  options: {
    getDefaultCfg() {
      return {
        config: {
          // 是否在拖拽节点时更新所有与之相连的边
          updateEdge: true,
          edgeLabel: true,
        },
      }
    },
    getEvents() {
      return {
        "editor:addNode": "startAddNode",
        "node:mousedown": "onNodeMousedown",
        "node:mouseup": "onNodeMouseup",
        "node:mouseenter": "onNodeMouseenter",
        "node:mouseleave": "onNodeMouseout",
        "node:contextmenu": "onNodeContextmenu",
        "canvas:mousedown": "onCanvasMousedown",
        "canvas:mousemove": "onCanvasMousemove",
        "canvas:contextmenu": "onCanvasContextmenu",
        "edge:mousedown": "onEdgeMousedown",
        "edge:mouseup": "onEdgeMouseup",
        "edge:contextmenu": "onEdgeContextmenu",
        "edge:mouseenter": "onEdgeMouseenter",
        "edge:mouseleave": "onEdgeMouseleave",
        "edge:dblclick": "onEdgeDblclick",
        // mousedown: "onMousedown",
        mousemove: "onMousemove",
        mouseup: "onMouseup",
      }
    },
    startAddNode(node) {
      let _t = this
      let newnode = {
        ...node,
        id: node.type + "_" + Utils.uniqueId(6),
        style: {
          fill: _t.graph.$X.fill,
          stroke: _t.graph.$X.lineColor,
          fillOpacity: _t.graph.$X.fillOpacity,
          lineWidth: _t.graph.$X.lineWidth,
          ...config.line.type[_t.graph.$X.lineStyle],
          ...node.style,
        },
      }
      _t.graph.addItem("node", newnode)
    },
    onNodeMousedown(event) {
      let _t = this
      let model = event.item.getModel()
      _t.doClearAllStates()
      _t.graph.setItemState(event.item, "active", true)
      if (model.editable !== false) {
        Utils.bus.emit("editor/editpanel/show", model)
      }
      Utils.bus.emit("editor/edgepanel/hide")
      if (event.originalEvent.button !== 0) return
      // 初始化数据
      _t.info = {
        type: null,
        node: event.item,
        target: event.target,
      }
      if (_t.info.target && _t.info.target.attr("name")) {
        switch (_t.info.target.attr("name")) {
          case "anchorPoint":
            _t.info.type = "drawLine"
            break
          case "shapeControlPoint":
            _t.info.type = "shapeControlPoint"
        }
      } else {
        _t.info.type = "dragNode"
      }
      if (_t.info && _t.info.type && _t[_t.info.type] && _t[_t.info.type].start) {
        _t[_t.info.type].start.call(_t, event)
      }
    },
    onNodeMouseup(event) {
      let _t = this
      let model = event.item.getModel()
      _t.graph.emit("editor:getItem", {
        type: "node",
        id: model.id,
        model: model,
      })
      if (_t.info && _t.info.type && _t[_t.info.type].stop) {
        _t[_t.info.type].stop.call(_t, event)
      }
    },
    onNodeMouseenter(event) {
      let _t = this
      _t.graph.setItemState(event.item, "hover", true)
    },
    onNodeMouseout(event) {
      let _t = this
      if (!event.item.hasState("selected")) {
        _t.graph.setItemState(event.item, "hover", false)
      }
    },
    onNodeContextmenu(event) {
      let _t = this
      event.preventDefault()
      _t.graph.emit("editor:contextmenu", {
        type: "node",
        x: event.clientX,
        y: event.clientY,
        canvasX: event.canvasX,
        canvasY: event.canvasY,
      })
      let model = event.item.getModel()
      _t.graph.emit("editor:getItem", {
        type: "node",
        id: model.id,
        model: model,
      })
    },
    onMousedown() {},
    onCanvasMousedown(event) {
      // var _t = this
      this.doClearAllStates()
      Utils.bus.emit("editor/editpanel/hide")
      Utils.bus.emit("editor/edgepanel/hide")
      if (event.originalEvent.button !== 0) return
      // if (!_t.graph.$X.isCrop) {
      //   // 初始化数据
      //   _t.info = {
      //     type: "dragCanvas",
      //   }
      // } else {
      //   // 初始化数据
      //   _t.info = {
      //     type: "drawGroup",
      //     startPosition: {
      //       x: event.x,
      //       y: event.y,
      //     },
      //   }
      // }

      // if (_t.info && _t.info.type && _t[_t.info.type].start) {
      //   _t[_t.info.type].start.call(_t, event)
      // }
    },
    onCanvasMousemove() {},
    onCanvasContextmenu(event) {
      let _t = this
      event.preventDefault()
      _t.graph.emit("editor:contextmenu", {
        type: "canvas",
        x: event.clientX,
        y: event.clientY,
        canvasX: event.canvasX,
        canvasY: event.canvasY,
      })
    },
    // 清除所有状态
    doClearAllStates() {
      let _t = this
      if (!_t.graph) {
        return
      }
      // 批量操作时关闭自动重绘，以提升性能
      _t.graph.setAutoPaint(false)
      _t.graph.getNodes().forEach(function (node) {
        _t.graph.clearItemStates(node, ["active", "hover", "selected"])
      })
      _t.graph.getEdges().forEach(function (edge) {
        _t.graph.clearItemStates(edge, ["active", "hover", "selected"])
      })
      _t.graph.paint()
      _t.graph.setAutoPaint(true)
    },
    onEdgeMousedown(event) {
      let _t = this
      let model = event.item.getModel()
      _t.graph.emit("editor:getItem", {
        type: "edge",
        id: model.id,
        model: model,
      })
      _t.doClearAllStates()
      if (event.item && !event.item.destroyed) {
        _t.graph.setItemState(event.item, "active", !event.item.hasState("active"))
      }
      Utils.bus.emit("editor/editpanel/hide")
      Utils.bus.emit("editor/edgepanel/show", model)
    },
    onEdgeMouseup(event) {
      let _t = this
      if (_t.info && _t.info.type === "drawLine") {
        _t[_t.info.type].stop.call(_t, event)
      }
    },
    onEdgeMouseenter(event) {
      let _t = this
      if (!event.item.hasState("active")) {
        _t.graph.setItemState(event.item, "hover", true)
      }
    },
    onEdgeMouseleave(event) {
      let _t = this
      if (!event.item.hasState("active")) {
        _t.graph.setItemState(event.item, "hover", false)
      }
    },
    onEdgeContextmenu(event) {
      let _t = this
      event.preventDefault()
      _t.graph.emit("editor:contextmenu", {
        type: "edge",
        x: event.clientX,
        y: event.clientY,
        canvasX: event.canvasX,
        canvasY: event.canvasY,
      })
    },
    onEdgeDblclick(event) {
      const _t = this
      if (_t.config.edgeLabel) {
        _t.edgeLabel.create.call(_t, event)
      }
    },
    onMousemove(event) {
      let _t = this
      if (_t.info && _t.info.type && _t[_t.info.type].move) {
        _t[_t.info.type].move.call(_t, event)
      }
    },
    onMouseup(event) {
      let _t = this
      if (_t.info) {
        if (_t.info.type === "dragNode") {
          _t[_t.info.type].stop.call(_t, event)
        } else if (_t.info.type && _t[_t.info.type].stop) {
          _t[_t.info.type].stop.call(_t, event)
        }
      }
    },
    resetZoom() {
      this.graph.getEdges().map((a) => a.toFront())
      this.graph.getNodes().map((a) => (a.getModel().type == "groupShape" ? a.toBack() : a.toFront()))
    },
    dragCanvas: {
      dragEvent: { startX: 0, startY: 0 },
      start(event) {
        this.dragCanvas.dragEvent.startX = event.x
        this.dragCanvas.dragEvent.startY = event.y
      },
      move(event) {
        const x = event.x - this.dragCanvas.dragEvent.startX
        const y = event.y - this.dragCanvas.dragEvent.startY
        this.graph.translate(x, y)
      },
      stop() {
        this.info = null
      },
    },
    drawLine: {
      isMoving: false,
      currentLine: null,
      status: "",
      currentType: "", //source or target
      dragEvent: { startX: 0, startY: 0 },
      start(event) {
        let _t = this
        let sourceAnchor
        let startModel = _t.info.node.getModel()
        // 锚点数据
        let anchorPoints = _t.info.node.getAnchorPoints()
        var edges = _t.graph.getEdges().filter((a) => a.getModel().source == startModel.id || a.getModel().target == startModel.id)
        // 处理线条目标点
        if (anchorPoints && anchorPoints.length) {
          // 获取距离指定坐标最近的一个锚点
          sourceAnchor = _t.info.node.getLinkPoint({ x: event.x, y: event.y })
        }
        //找到当前点击的线条
        var current = edges.find((edge) => {
          var m = edge.getModel()
          return (sourceAnchor && sourceAnchor.x == m.startPoint.x && sourceAnchor.y == m.startPoint.y && (_t.drawLine.currentType = "source")) || (sourceAnchor.x == m.endPoint.x && sourceAnchor.y == m.endPoint.y && (_t.drawLine.currentType = "target"))
        })
        if (current) {
          _t.drawLine.currentLine = current
          console.log("_t.drawLine.currentLine", _t.drawLine.currentLine)
          _t.drawLine.isMoving = true
          _t.drawLine.status = "edit"
          _t.drawLine.dragEvent.source = _t.drawLine.currentLine.getModel().source
          _t.drawLine.dragEvent.target = _t.drawLine.currentLine.getModel().target
          console.log("_t.drawLine.dragEvent", _t.drawLine.dragEvent)
          return
        }
        _t.drawLine.status = "add"
        _t.drawLine.currentType = "target"
        var edge = {
          id: Utils.uniqueId(6),
          // 起始节点
          source: startModel.id,
          sourceAnchor: sourceAnchor ? sourceAnchor.anchorIndex : "",
          // 终止节点/位置
          target: {
            x: event.x,
            y: event.y,
          },
          lineAppendWidth: 20,
          attrs: {},
          label: "",
          style: {
            stroke: _t.graph.$X.lineColor,
            lineWidth: _t.graph.$X.lineWidth,
            ...config.line.type[_t.graph.$X.lineStyle],
          },
          labelCfg: {
            style: {
              fill: "#000",
              fontSize: 16,
              stroke: "#fff",
              lineWidth: 1,
            },
          },
          // FIXME 边的形式需要与工具栏联动
          type: _t.graph.$X.lineType || "line",
          startArrow: _t.graph.$X.startArrow || false,
          endArrow: _t.graph.$X.endArrow || false,
        }
        _t.drawLine.currentLine = _t.graph.addItem("edge", edge)
        _t.drawLine.currentLine.toBack()
        _t.drawLine.isMoving = true
      },
      move(event) {
        let _t = this
        if (_t.drawLine.isMoving && _t.drawLine.currentLine) {
          var attrs = {}
          attrs[_t.drawLine.currentType] = {
            x: event.x,
            y: event.y,
          }
          _t.graph.updateItem(_t.drawLine.currentLine, attrs)
        }
      },
      stop(event) {
        let _t = this
        if (_t.drawLine.isMoving) {
          if (_t.drawLine.currentLine === event.item) {
            // 画线过程中点击则移除当前画线
            _t.graph.removeItem(event.item)
          } else {
            let endNode = _t.drawLine.currentType == "target" ? event.item : _t.info.node
            let startNode = _t.drawLine.currentType == "target" ? _t.info.node : event.item
            let sourceNode = _t.drawLine.status == "add" ? _t.info.node : _t.drawLine.currentType == "target" ? _t.drawLine.currentLine.getSource() : event.item
            let targetNode = _t.drawLine.status == "add" ? event.item : _t.drawLine.currentType == "target" ? event.item : _t.drawLine.currentLine.getTarget()
            let startModel = startNode.getModel()
            let endModel = endNode.getModel()
            let targetAnchor
            // 锚点数据
            let anchorPoints = endNode.getAnchorPoints()
            // 处理线条目标点
            if (anchorPoints && anchorPoints.length) {
              if (_t.drawLine.currentType == "target") {
                // 获取距离指定坐标最近的一个锚点
                targetAnchor = endNode.getLinkPoint({ x: event.x, y: event.y })
              } else {
                targetAnchor = startNode.getLinkPoint({ x: event.x, y: event.y })
              }
            }
            let pass = true
            console.log("sourceNode", sourceNode)
            //不能连自己
            if (sourceNode.getModel().id == targetNode.getModel().id) {
              pass = false
              alert("不能连自己")
            }
            //如果已经存在连线，则不能连
            if (
              _t.graph
                .getEdges()
                .filter((item) => item.getModel().source && item.getModel().target)
                .some((item) => item.getModel().source == sourceNode.getModel().id && item.getModel().target == targetNode.getModel().id)
            ) {
              pass = false
              alert("请勿重复连接")
            }

            if (_t.drawLine.status == "edit" && pass) {
              var endId = _t.drawLine.currentType == "target" ? endModel.id : _t.drawLine.currentLine.getModel().target
              var startId = _t.drawLine.currentType == "target" ? _t.drawLine.currentLine.getModel().source : startModel.id
              if (_t.graph.getEdges().some((a) => a.getModel().id !== _t.drawLine.currentLine.getModel().id && a.getModel().source == startId && a.getModel().target == endId)) {
                alert("已存在连线，请勿重复连接")

                pass = false
              }
            }

            if (pass) {
              let updateData
              if (_t.drawLine.currentType == "target") {
                updateData = {
                  target: endModel.id,
                  targetAnchor: targetAnchor ? targetAnchor.anchorIndex : "",
                  attrs: {
                    start: startModel.id,
                    end: endModel.id,
                  },
                }
              } else {
                updateData = {
                  source: startModel.id,
                  sourceAnchor: targetAnchor ? targetAnchor.anchorIndex : "",
                  attrs: {
                    start: startModel.id,
                    end: endModel.id,
                  },
                }
              }
              _t.graph.updateItem(_t.drawLine.currentLine, updateData)
              // _t.drawLine.currentLine.toFront()

              // 记录操作日志
              _t.graph.emit("editor:record", "drawLine stop")
            } else {
              if (_t.drawLine.status == "add") {
                _t.graph.removeItem(_t.drawLine.currentLine)
              } else {
                let attrs = {}
                attrs.source = _t.drawLine.dragEvent.source
                attrs.target = _t.drawLine.dragEvent.target
                _t.graph.updateItem(_t.drawLine.currentLine, attrs)
              }
            }
          }
        }
        _t.drawLine.currentLine = null
        _t.drawLine.isMoving = false
        _t.info = null
        _t.resetZoom()
      },
    },

    // 框选
    drawGroup: {
      isMoving: false,
      // 选框节点
      marqueeNode: null,
      start(event) {
        event.preventDefault()
        console.log("执行 start")
        const _t = this
        _t.drawGroup.isMoving = true
        // 清除已有group
        _t.graph.getNodes().forEach((item) => {
          // 更新节点
          _t.graph.updateItem(item, {
            groupId: "",
          })
        })
      },
      move(event) {
        console.log("执行了move")
        const _t = this
        if (!_t.graph.$X.isCrop) {
          return
        }
        event.preventDefault()
        if (_t.info && _t.drawGroup.isMoving) {
          // 计算坐标、宽高
          const { startPosition } = _t.info
          const x = startPosition.x + (event.x - startPosition.x) / 2
          const y = startPosition.y + (event.y - startPosition.y) / 2
          const width = Math.abs(event.x - startPosition.x)
          const height = Math.abs(event.y - startPosition.y)
          if (!_t.drawGroup.marqueeNode) {
            // 绘制虚线框
            const node = {
              id: Utils.uniqueId(6),
              type: "groupShape",
              x: x,
              y: y,
              size: [width, height],
              width,
              height,
              editable: false,
              shapeControl: {
                // 控制器
                controllers: [
                  [0, 0, "nwse-resize"],
                  [0, 0.5, "ew-resize"],
                  [0, 1, "nesw-resize"],
                  [0.5, 0, "ns-resize"],
                  [0.5, 1, "ns-resize"],
                  [1, 0, "nesw-resize"],
                  [1, 0.5, "ew-resize"],
                  [1, 1, "nwse-resize"],
                ],
                // 旋转
                rotate: false,
              },
              style: {
                lineWidth: 1,
                //   stroke: '#29B6F2',
                // lineDash: [ 5, 5 ],
                strokeOpacity: 0,
                fill: "#262b30",
                fillOpacity: 1,
                opacity: 1,
                minDis: 20,
                maxDis: 40,
                cursor: "default",
              },
            }
            _t.drawGroup.marqueeNode = _t.graph.addItem("node", node)
            _t.drawGroup.marqueeNode.toBack() //将框选层置于底层
          } else {
            _t.graph.updateItem(_t.drawGroup.marqueeNode, {
              x: x,
              y: y,
              width,
              height,
              size: [width, height],
            })
          }
        }
      },
      stop() {
        const _t = this
        // console.log('drawGroup stop')
        if (_t.info && _t.drawGroup.isMoving && _t.drawGroup.marqueeNode) {
          const { minX: marqueeNodeMinX, maxX: marqueeNodeMaxX, minY: marqueeNodeMinY, maxY: marqueeNodeMaxY } = _t.drawGroup.marqueeNode.getBBox()
          // 当前节点数组
          const currentItemArr = []
          const groupId = Utils.uniqueId()
          const marqueeNodeId = _t.drawGroup.marqueeNode.get("id")
          _t.graph.getNodes().forEach((item) => {
            const model = item.getModel()
            const { id } = model
            const { minX, maxX, minY, maxY } = item.getBBox()
            // 判断节点是否在组区域内
            if (id !== marqueeNodeId && minX > marqueeNodeMinX && maxX < marqueeNodeMaxX && minY > marqueeNodeMinY && maxY < marqueeNodeMaxY) {
              // 更新节点
              _t.graph.updateItem(item, {
                groupId,
              })
              // 设置激活
              _t.graph.setItemState(item, "active", true)
              currentItemArr.push({
                type: "node",
                id: id,
                model: item.getModel(),
              })
            }
          })
          // 删除选框节点
          // _t.graph.removeItem(_t.drawGroup.marqueeNode)
        }
        _t.drawGroup.isMoving = false
        _t.drawGroup.marqueeNode = null
      },
    },
    // 图形控制 缩放
    shapeControlPoint: {
      isMoving: false,
      // 是否等比缩放
      isProportional: false,
      // 原始节点信息
      originNodeModel: null,
      start(event) {
        const _t = this
        const model = _t.info.node.getModel()
        _t.shapeControlPoint.originNodeModel = {
          x: model.x,
          y: model.y,
          startX: event.x,
          startY: event.y,
          minWidth: model.minWidth,
          minHeight: model.minHeight,
          size: model.size || [],
        }
        _t.shapeControlPoint.isMoving = true
        // 是否等比缩放
        // FIXME !!! 此处应该通过物料配置控制
        _t.shapeControlPoint.isProportional = ["square", "circle", "bidirectional-arrow", "arrow"].includes(model.type)
      },
      move(event) {
        const _t = this
        const originNodeModel = _t.shapeControlPoint.originNodeModel
        if (_t.info.node && _t.info.target && originNodeModel && _t.shapeControlPoint.isMoving) {
          const model = _t.info.node.getModel()
          // 判断位置
          const position = _t.info.target.attr("position") || null
          const attrs = {
            x: originNodeModel.x,
            y: originNodeModel.y,
            size: [...model.size],
          }
          const width = model.width
          const height = model.height
          if (position) {
            // 参照点，及当前controller的对角点
            // 参照点位置信息
            const referencePosition = [1 - position.x, 1 - position.y]
            // 相对图形坐标原点，(0,0)点位于图形左上角，与position的坐标系相同
            const originX = originNodeModel.x - width / 2
            const originY = originNodeModel.y - height / 2
            // 参照点坐标
            const referencePoint = {
              x: referencePosition[0] * width + originX,
              y: referencePosition[1] * height + originY,
            }
            // 计算中心点坐标
            //   attrs.x = referencePoint.x + (event.x - referencePoint.x) / 2
            //   attrs.y = referencePoint.y + (event.y - referencePoint.y) / 2
            // 计算图形宽高
            if (_t.shapeControlPoint.isProportional) {
              attrs.size[0] = attrs.size[1] = Math.abs(referencePoint.x - event.x)
            } else if (position.x == 0.5 && position.y == 1) {
              //下
              attrs.size[1] = originNodeModel.size[1] + event.y - originNodeModel.startY
              attrs.y = originNodeModel.y + (event.y - originNodeModel.startY) / 2
            } else if (position.x == 1 && position.y == 0.5) {
              //右
              attrs.size[0] = originNodeModel.size[0] + event.x - originNodeModel.startX
              attrs.x = originNodeModel.x + (event.x - originNodeModel.startX) / 2
            } else if (position.x == 1 && position.y == 1) {
              //右下
              attrs.size[0] = originNodeModel.size[0] + event.x - originNodeModel.startX
              attrs.x = originNodeModel.x + (event.x - originNodeModel.startX) / 2
              attrs.size[1] = originNodeModel.size[1] + event.y - originNodeModel.startY
              attrs.y = originNodeModel.y + (event.y - originNodeModel.startY) / 2
            } else if (position.x == 0 && position.y == 0) {
              //左上
              attrs.size[1] = originNodeModel.size[1] - event.y + originNodeModel.startY
              attrs.y = originNodeModel.y + (event.y - originNodeModel.startY) / 2
              attrs.size[0] = originNodeModel.size[0] - event.x + originNodeModel.startX
              attrs.x = originNodeModel.x + (event.x - originNodeModel.startX) / 2
            } else if (position.x == 0.5 && position.y == 0) {
              //上
              attrs.size[1] = originNodeModel.size[1] - event.y + originNodeModel.startY
              attrs.y = originNodeModel.y + (event.y - originNodeModel.startY) / 2
            } else if (position.x == 1 && position.y == 0) {
              //右上
              attrs.size[1] = originNodeModel.size[1] - event.y + originNodeModel.startY
              attrs.y = originNodeModel.y + (event.y - originNodeModel.startY) / 2
              attrs.size[0] = originNodeModel.size[0] + event.x - originNodeModel.startX
              attrs.x = originNodeModel.x + (event.x - originNodeModel.startX) / 2
            } else if (position.x == 0 && position.y == 0.5) {
              //左
              attrs.size[0] = originNodeModel.size[0] - event.x + originNodeModel.startX
              attrs.x = originNodeModel.x + (event.x - originNodeModel.startX) / 2
            } else if (position.x == 0 && position.y == 1) {
              //左下
              attrs.size[1] = originNodeModel.size[1] + event.y - originNodeModel.startY
              attrs.y = originNodeModel.y + (event.y - originNodeModel.startY) / 2
              attrs.size[0] = originNodeModel.size[0] - event.x + originNodeModel.startX
              attrs.x = originNodeModel.x + (event.x - originNodeModel.startX) / 2
            }

            // 处理宽高最小值
            if (attrs.size[0] < originNodeModel.minWidth || attrs.size[1] < originNodeModel.minHeight) {
              return
            }
          } else {
            return
          }
          // 格式化size
          attrs.size[0] = parseInt(attrs.size[0])
          attrs.size[1] = parseInt(attrs.size[1])
          // 设置宽高
          attrs.width = attrs.size[0]
          attrs.height = attrs.size[1]
          // 存储attrs
          _t.info.attrs = attrs
          // 当前节点容器
          const group = _t.info.node.getContainer()
          // 更新锚点
          utils.anchor.update(
            {
              ..._t.info.node.getModel(),
              width: attrs.size[0],
              height: attrs.size[1],
            },
            group
          )
          // 更新shapeControl
          utils.shapeControl.update(
            {
              ..._t.info.node.getModel(),
              width: attrs.size[0],
              height: attrs.size[1],
            },
            group
          )
          // 更新节点
          _t.graph.updateItem(_t.info.node, attrs)
          _t.graph.refreshItem(_t.info.node)
        }
      },
      stop() {
        const _t = this
        if (_t.info.node && _t.info.attrs && _t.shapeControlPoint.originNodeModel && _t.shapeControlPoint.isMoving) {
          const attrs = _t.info.attrs
          // 当前节点容器
          const group = _t.info.node.getContainer()
          // 更新锚点
          utils.anchor.update(
            {
              ..._t.info.node.getModel(),
              width: attrs.size[0],
              height: attrs.size[1],
            },
            group
          )
          // 更新shapeControl
          utils.shapeControl.update(
            {
              ..._t.info.node.getModel(),
              width: attrs.size[0],
              height: attrs.size[1],
            },
            group
          )
          // 更新节点
          _t.graph.updateItem(_t.info.node, attrs)
          // 记录操作日志
          _t.graph.emit("editor:record", "shapeControlPoint stop")
        }
        _t.shapeControlPoint.originNodeModel = null
        _t.shapeControlPoint.isMoving = false
        _t.info = null
      },
    },
    dragNode: {
      groupNodes: [],
      status: null,
      start(event) {
        let _t = this
        _t.info.eventTarget = {
          estartX: event.x,
          estartY: event.y,
        }
        _t.dragNode.status = "dragNode"
        /* 点击的节点上增加鼠标位置变量做标记，end时删除此变量 */
        var startNodeModel = _t.info.node.getModel()
        _t.info.eventTarget.startX = startNodeModel.x
        _t.info.eventTarget.startY = startNodeModel.y

        if (startNodeModel.type == "groupShape") {
          //找到所有在组中的节点
          var minX = startNodeModel.x - startNodeModel.width / 2
          var maxX = startNodeModel.x + startNodeModel.width / 2
          var minY = startNodeModel.y - startNodeModel.height / 2
          var maxY = startNodeModel.y + startNodeModel.height / 2
          _t.dragNode.groupNodes = _t.graph
            .getNodes()
            .filter((item) => {
              var model = item.getModel()
              if (minX <= model.x - model.width / 2 && maxX >= model.x + model.width / 2 && minY <= model.y - model.height / 2 && maxY >= model.y + model.height / 2) {
                return true
              }
              return false
            })
            .map((item) => {
              return { startX: item.getModel().x, startY: item.getModel().y, node: item, model: item.getModel() }
            })
        }
      },
      move(event) {
        event.preventDefault()
        let _t = this
        if (_t.dragNode.status === "dragNode") {
          if (_t.info.node) {
            let attrs = {
              x: _t.info.eventTarget.startX + event.x - _t.info.eventTarget.estartX,
              y: _t.info.eventTarget.startY + event.y - _t.info.eventTarget.estartY,
            }
            // 更新节点
            _t.graph.updateItem(_t.info.node, attrs)
            if (_t.dragNode.groupNodes.length) {
              _t.dragNode.groupNodes.forEach((a) => {
                let attrs1 = {
                  x: a.startX + event.x - _t.info.eventTarget.estartX,
                  y: a.startY + event.y - _t.info.eventTarget.estartY,
                }
                _t.graph.updateItem(a.node, attrs1)
              })
            }
          }
        }
      },
      stop() {
        let _t = this
        if (_t.info && _t.info.node) {
          _t.info.eventTarget = null
          //更新store数据
          let model = _t.info.node.getModel()
          _t.graph.emit("editor:getItem", {
            type: "node",
            id: model.id,
            model: model,
          })
        }
        _t.dragNode.groupNodes = []
        // 记录操作日志
        _t.graph.emit("editor:record", "dragnode stop")
        _t.dragNode.clear.call(_t)

        // _t.graph.paint()
      },
      clear() {
        let _t = this
        _t.dragNode.status = null
        _t.info = null
      },
    },
    // 边Label
    edgeLabel: {
      // 节点文本创建
      create(event) {
        const _t = this
        const canvas = _t.graph.get("canvas")
        const edge = event.item
        const model = edge.getModel()
        const { label, source, sourceAnchor, target, targetAnchor } = model
        // 查找节点
        const sourceNode = _t.graph.findById(source)
        const targetNode = _t.graph.findById(target)
        // 查找锚点
        const sourceAnchors = sourceNode.getAnchorPoints()
        const targetAnchors = targetNode.getAnchorPoints()
        // 查找锚点信息
        const sourceAnchorPoint = this.graph.getCanvasByPoint(sourceAnchors[sourceAnchor].x, sourceAnchors[sourceAnchor].y)
        const targetAnchorPoint = this.graph.getCanvasByPoint(targetAnchors[targetAnchor].x, targetAnchors[targetAnchor].y)
        let left
        let top
        const minWidth = 40
        const maxWidth = 100
        let width = 40
        const height = 20
        const distance = Math.abs(targetAnchorPoint.x - sourceAnchorPoint.x)
        if (distance < minWidth) {
          width = minWidth
        }
        if (distance > maxWidth) {
          width = maxWidth
        }
        // 计算输入框位置
        if (sourceAnchorPoint.x < targetAnchorPoint.x) {
          left = sourceAnchorPoint.x + distance / 2 - width / 2 + "px"
        } else {
          left = targetAnchorPoint.x + distance / 2 - width / 2 + "px"
        }
        if (sourceAnchorPoint.y < targetAnchorPoint.y) {
          top = sourceAnchorPoint.y + Math.abs(targetAnchorPoint.y - sourceAnchorPoint.y) / 2 - height / 2 + "px"
        } else {
          top = targetAnchorPoint.y + Math.abs(targetAnchorPoint.y - sourceAnchorPoint.y) / 2 - height / 2 + "px"
        }
        const el = canvas.get("el")
        const html = el.parentNode.querySelector(".inputBox")
        if (html) {
          html.value = label
          // 更新输入框样式
          G6DomUtil.modifyCSS(html, {
            display: "inline-block",
            position: "absolute",
            left: left,
            top: top,
            width: width + "px",
            height: height + "px",
            lineHeight: height + "px",
            textAlign: "center",
            overflow: "hidden",
            fontSize: "14px",
          })
          if (html.focus) {
            html.focus()
          }
          const handler = function () {
            // 更新节点
            _t.graph.updateItem(edge, {
              label: html.value,
              // labelCfg: {
              //   position: 'center',
              //   style: {
              //     fontSize: 16,
              //     stroke: '#ffffff',
              //     lineWidth: 0
              //   }
              // }
            })
            html.removeEventListener("blur", handler)
            // 隐藏输入框dom
            G6DomUtil.modifyCSS(html, {
              display: "none",
            })
          }
          html.addEventListener("blur", handler)
        }
      },
    },
  },
}
