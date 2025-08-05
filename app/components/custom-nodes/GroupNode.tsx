"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";

const GroupNode = ({ data }: NodeProps) => {
  return (
    <div className="rounded-lg border-2 border-dashed border-slate-500 bg-slate-800/50 p-4 shadow-lg backdrop-blur-sm">
      <div className="text-center font-bold text-slate-300">{data.label}</div>
      <Handle type="source" position={Position.Top} className="!w-3 !h-3" />
      <Handle type="target" position={Position.Bottom} className="!w-3 !h-3" />
    </div>
  );
};

export default memo(GroupNode);
