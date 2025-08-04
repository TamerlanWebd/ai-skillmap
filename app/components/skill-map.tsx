"use client";

import React from "react";
import ReactFlow, { Controls, Background } from "reactflow";
import useSkillMapStore from "@/stores/skillMapStore";
import "reactflow/dist/style.css";

function SkillMap() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
    useSkillMapStore();

  return (
    <div style={{ height: "calc(100vh - 81px)" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default SkillMap;
