"use client";

import { Button } from "@/components/ui/button";
import useSkillMapStore from "@/stores/skillMapStore";
import { Layers } from "lucide-react";

export function AddGroupButton() {
  const addNode = useSkillMapStore((state) => state.addSkillNode);

  const handleAddGroup = () => {
    const groupName = prompt("Введите название группы:", "Новая группа");
    if (groupName) {
      addNode(groupName, "group");
    }
  };

  return (
    <Button variant="outline" onClick={handleAddGroup}>
      <Layers className="mr-2 h-4 w-4" />
      Создать группу
    </Button>
  );
}
