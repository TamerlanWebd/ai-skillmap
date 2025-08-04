"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import useSkillMapStore from "@/stores/skillMapStore";
import { PlusCircle } from "lucide-react";
import { Label } from "@/components/ui/label";

export function AddSkillDialog() {
  const addSkillNode = useSkillMapStore((state) => state.addSkillNode);
  const [skillName, setSkillName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = () => {
    if (skillName.trim()) {
      addSkillNode(skillName.trim());
      setSkillName("");
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Добавить навык
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Добавить новый навык</DialogTitle>
          <DialogDescription>
            Введите название технологии или навыка.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Label htmlFor="skill-name">Название</Label>
          <Input
            id="skill-name"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            placeholder="Например, TypeScript"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Добавить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
