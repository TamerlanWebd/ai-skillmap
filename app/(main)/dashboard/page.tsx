"use client";

import { AddSkillDialog } from "@/app/components/add-skill-dialog";
import { AddGroupButton } from "@/app/components/add-group-button";
import { EditSkillDialog } from "@/app/components/edit-skill-dialog";
import SkillMapContainer from "@/app/components/skill-map";
import useSkillMapStore from "@/stores/skillMapStore";
import { Button } from "@/components/ui/button";
import { Sparkles, LoaderCircle } from "lucide-react";

export default function DashboardPage() {
  const { isGenerating, getAiSuggestions } = useSkillMapStore();

  return (
    <div className="relative h-full w-full">
      <SkillMapContainer />

      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <Button
          onClick={() => getAiSuggestions()}
          disabled={isGenerating}
          variant="outline"
        >
          {isGenerating ? (
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          AI-помощник
        </Button>
        <AddGroupButton />
        <AddSkillDialog />
      </div>

      <EditSkillDialog />
    </div>
  );
}
