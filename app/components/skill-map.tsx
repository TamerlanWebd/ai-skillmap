"use client";

import React, { useEffect } from "react";
import ReactFlow, { Controls, Background } from "reactflow";
import useSkillMapStore from "@/stores/skillMapStore";
import { SkillNode } from "./custom-nodes/SkillNode";

import "reactflow/dist/style.css";

const nodeTypes = { skill: SkillNode };

function SkillMap() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    loadMap,
    isLoaded,
  } = useSkillMapStore();
  useEffect(() => {
    loadMap();
  }, [loadMap]);
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-65px)]">
        <p className="text-lg text-muted-foreground">Загрузка вашей карты...</p>
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
