import { BuilderContextState, NodeElementProps, NodeId } from "~types";
import React from "react";
import NodeContext from "./NodeContext";
import BuilderContext from "../BuilderContext";
import NodeCanvasContext from "./NodeCanvasContext";

export default class NodeElement extends React.Component<NodeElementProps> {
  loopInfo = {
    index: 0
  }
  componentDidUpdate() {
    this.loopInfo.index = 0;
  }
  constructor(props: NodeElementProps) {
    super(props);
  }
  render() {
    const { node } = this.props;
    return (
      <BuilderContext.Consumer>
        {(builder: BuilderContextState) => {
          const nodeProvider = {
            node,
            nodeState: {
              active: builder.active && builder.active.id === node.id,
              hover: builder.hover && builder.hover.id === node.id,
              dragging: builder.dragging && builder.dragging.id === node.id
            },
            builder
          }
          return (
            <NodeContext.Provider value={nodeProvider}>
              <NodeCanvasContext.Provider value={{
                 ...nodeProvider,
                 childCanvas: builder.nodes[node.id].childCanvas ? builder.nodes[node.id].childCanvas : {}, 
                 pushChildCanvas: (canvasId: string, canvasNodeId: NodeId) => {
                  if (!node.childCanvas) node.childCanvas = {};
                  builder.setNodes((nodes) => {
                    if (!nodes[node.id].childCanvas ) nodes[node.id].childCanvas = {};
                    nodes[node.id].childCanvas[canvasId] = canvasNodeId;
                    return nodes;
                  });
                }
              }}> 
                {
                  this.props.children
                }
              </NodeCanvasContext.Provider>
            </NodeContext.Provider>
          )
        }}
      </BuilderContext.Consumer>
    )
  }
}
