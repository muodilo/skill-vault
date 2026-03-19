"use client";

import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { CiCalendar } from "react-icons/ci";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

interface Task {
  id: string;
  completed: boolean;
}

interface Skill {
  id: string;
  title: string;
  createdAt: string;
  tasks: Task[];
}

export default function SkillCard({
  skill,
  onEdit,
  onDelete,
}: {
  skill: Skill;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const totalTasks = skill.tasks.length;
  const completedTasks = skill.tasks.filter((t) => t.completed).length;
  const progress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const startedDate = new Date(skill.createdAt).toLocaleDateString();

  return (
    <div className="border rounded-xl p-5 shadow bg-white">
      <div className="flex items-center justify-between mb-3">
        <Link href={`dashboard/skill/${skill.id}`} className="font-semibold text-lg">{skill.title}</Link>
        <div className="flex items-center gap-2">
          <button onClick={onEdit}>
            <FaEdit />
          </button>
          <button onClick={onDelete}>
            <MdDelete />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-2 text-xs text-neutral-500">
        <p>Progress</p>
        <p>
          {completedTasks}/{totalTasks} Tasks
        </p>
      </div>

      <Progress value={progress} />

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <CiCalendar />
          <p>Started on {startedDate}</p>
        </div>
        <p className="text-xs text-primaryColor bg-primaryColor/20 px-2 py-1 rounded">
          {progress === 100 ? "Completed" : "In Progress"}
        </p>
      </div>
    </div>
  );
}
