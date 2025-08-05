"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import useSkillMapStore from "@/stores/skillMapStore";

export type SkillNodeData = {
  label: string;
  progress: number;
  url?: string;
};

export const SkillNode = memo(({ id, data }: NodeProps<SkillNodeData>) => {
  const nodes = useSkillMapStore.getState().nodes;
  const currentNode = nodes.find((node) => node.id === id);
  const isChild = !!currentNode?.parentNode;

  return (
    <Card
      className={cn(
        "shadow-lg border-2 border-transparent hover:border-primary transition-colors duration-200",
        isChild ? "w-48" : "w-64"
      )}
    >
      <CardHeader className={cn(isChild ? "p-2" : "p-4")}>
        <CardTitle className={cn(isChild ? "text-sm" : "text-base")}>
          {data.label}
        </CardTitle>
      </CardHeader>

      <CardContent className={cn("pt-0", isChild ? "p-2" : "p-4")}>
        <div className="flex flex-col gap-1">
          {!isChild && (
            <p className="text-xs text-muted-foreground">Прогресс изучения</p>
          )}
          <Progress value={data.progress} className="w-full h-2" />
          <p className="text-right text-sm font-bold">{data.progress}%</p>
        </div>
      </CardContent>

      <Handle type="target" position={Position.Top} className="!bg-teal-500" />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-teal-500"
      />
    </Card>
  );
});

SkillNode.displayName = "SkillNode";
