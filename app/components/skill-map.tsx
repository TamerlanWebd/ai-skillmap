"use client";

import React, { useEffect } from "react";
import ReactFlow, {
  Controls,
  Background,
  Node,
  MiniMap,
  NodeProps,
  ReactFlowProvider,
  useReactFlow,
} from "reactflow";
import useSkillMapStore from "@/stores/skillMapStore";
import { SkillNode } from "@/app/components/custom-nodes/SkillNode";
import GroupNode from "@/app/components/custom-nodes/GroupNode";
import { LoaderCircle } from "lucide-react";

import "reactflow/dist/style.css";

const nodeTypes = {
  skill: SkillNode,
  group: GroupNode,
};

function SkillMap() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    isLoaded,
    setEditingNode,
    setNodeParent,
  } = useSkillMapStore();
  const { getIntersectingNodes } = useReactFlow();

  useEffect(() => {
    useSkillMapStore.getState().loadMap();
  }, []);

  const handleNodeDoubleClick = (_: React.MouseEvent, node: Node) => {
    if (node.type !== "group") {
      setEditingNode(node.id);
    }
  };

  const handleNodeDragStop = (_: React.MouseEvent, node: Node) => {
    if (node.type === "group") return;

    const parentNodes = getIntersectingNodes(node).filter(
      (n) => n.type === "group"
    );
    const parentNode = parentNodes[0];

    if (!parentNode && node.parentNode) {
      setNodeParent(node.id, undefined);
    } else if (parentNode && parentNode.id !== node.parentNode) {
      setNodeParent(node.id, parentNode.id);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-65px)]">
        <LoaderCircle className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div style={{ height: "calc(100vh - 65px)" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onNodeDoubleClick={handleNodeDoubleClick}
        onNodeDragStop={handleNodeDragStop}
        fitView
        className="bg-background"
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

export default function SkillMapContainer() {
  return (
    <ReactFlowProvider>
      <SkillMap />
    </ReactFlowProvider>
  );
}
