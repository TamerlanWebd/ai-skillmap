"use client";

import { AddSkillDialog } from "@/app/components/add-skill-dialog";
import SkillMap from "@/app/components/skill-map";

export default function DashboardPage() {
  return (
    <div className="relative">
      <SkillMap />
      <div className="absolute top-4 right-4 z-10">
        <AddSkillDialog />
      </div>
    </div>
  );
}
