"use client";

import React, { useMemo } from "react";
import ReactFlow, { Controls, Background } from "reactflow";
import useSkillMapStore from "@/stores/skillMapStore";
import { SkillNode } from "./custom-nodes/SkillNode";

import "reactflow/dist/style.css";
const nodeTypes = {
  skill: SkillNode,
};

function SkillMap() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
    useSkillMapStore();

  return (
    <div style={{ height: "calc(100vh - 65px)" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-background"
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default SkillMap;
