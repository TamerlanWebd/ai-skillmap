"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import useSkillMapStore from "@/stores/skillMapStore";
import { SkillNodeData } from "./custom-nodes/SkillNode";

export function EditSkillDialog() {
  const { editingNodeId, setEditingNode, nodes, updateNodeData } =
    useSkillMapStore();

  const editingNode = nodes.find((n) => n.id === editingNodeId);

  const [data, setData] = useState<Partial<SkillNodeData>>({});
  useEffect(() => {
    if (editingNode) {
      setData(editingNode.data);
    }
  }, [editingNode]);

  const handleSave = () => {
    if (editingNodeId) {
      updateNodeData(editingNodeId, data);
    }
    handleClose();
  };

  const handleClose = () => {
    setEditingNode(null);
  };

  if (!editingNode) return null;

  return (
    <Dialog open={!!editingNodeId} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактировать навык</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="skill-label">Название</Label>
            <Input
              id="skill-label"
              value={data.label || ""}
              onChange={(e) => setData({ ...data, label: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="skill-url">URL (ссылка на ресурс)</Label>
            <Input
              id="skill-url"
              placeholder="https://example.com"
              value={data.url || ""}
              onChange={(e) => setData({ ...data, url: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Прогресс: {data.progress || 0}%</Label>
            <Slider
              value={[data.progress || 0]}
              onValueChange={(value) =>
                setData({ ...data, progress: value[0] })
              }
              max={100}
              step={5}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Отмена
          </Button>
          <Button onClick={handleSave}>Сохранить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
