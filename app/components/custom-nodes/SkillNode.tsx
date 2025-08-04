"use client";

import { Handle, Position, NodeProps } from "reactflow";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
export type SkillNodeData = {
  label: string;
  progress: number;
  url?: string;
};

export function SkillNode({ data }: NodeProps<SkillNodeData>) {
  return (
    <Card className="w-64 shadow-lg border-2 border-transparent hover:border-primary transition-colors duration-200">
      <CardHeader className="p-4">
        <CardTitle className="text-base">{data.label}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground">Прогресс изучения</p>
          <Progress value={data.progress} className="w-full" />
          <p className="text-right text-sm font-bold">{data.progress}%</p>
        </div>
        <Handle
          type="target"
          position={Position.Top}
          className="!bg-teal-500"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          className="!bg-teal-500"
        />
      </CardContent>
    </Card>
  );
}
