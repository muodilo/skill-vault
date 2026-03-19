"use client";

import useSWR from "swr";
import { Skill } from "@/types/skill";
import { Progress } from "@/components/ui/progress";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import TasksList from "./TasksList";
import ReflectionsList from "./ReflectionsList";
import AddSkillModal from "./skills/AddSkillModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FcTodoList } from "react-icons/fc";
import { FaBook } from "react-icons/fa6";
import { useState } from "react";

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
});

export default function SkillDetail({ skillId }: { skillId: string }) {
  const { data: skill, error, isLoading, mutate } = useSWR<Skill>(`/api/skills/${skillId}`, fetcher);
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    try {
      const res = await fetch(`/api/skills/${skillId}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("Failed to delete skill");
      }
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Error deleting skill:", err);
      alert("Failed to delete skill. Please try again.");
    }
  };

  const onTasksUpdated = () => {
    mutate();
  };

  if (isLoading) return (
    <div className="pt-5">
      <div className="skeleton w-full mb-7 h-44 bg-slate-200 rounded-lg animate-pulse"></div>
      <div className="skeleton w-full h-96 bg-slate-200 rounded-lg animate-pulse"></div>
    </div>
  );

  if (error) return <p className="text-red-600">{error.message || "Failed to load skill"}</p>;
  if (!skill) return <p>Skill not found.</p>;

  const totalTasks = skill.tasks.length;
  const completedTasks = skill.tasks.filter((t) => t.completed).length;
  const progress = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="pt-5">
      <div className="border rounded-xl p-5 shadow mb-6">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h1 className="text-2xl font-bold">{skill.title}</h1>
            <p className="text-neutral-600">{skill.description}</p>
            <p className="text-sm text-neutral-500">
              Started: {new Date(skill.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowModal(true)}>
              <FaEdit />
            </button>
            <button onClick={handleDelete}>
              <MdDelete />
            </button>
          </div>
        </div>
        <div>
          <p className="text-sm mb-1">Progress: {progress}%</p>
          <Progress value={progress} />
          <p className="text-xs mt-1">
            {completedTasks} / {totalTasks} tasks
          </p>
        </div>
      </div>

      <Tabs defaultValue="tasks" className="w-full">
        <div className="border bg-white rounded-lg px-5">
          <TabsList>
            <TabsTrigger value="tasks">
              <FcTodoList /> <p>Tasks</p>
            </TabsTrigger>
            <TabsTrigger value="reflections">
              <FaBook /> <p>Reflections</p>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="tasks">
          <TasksList tasks={skill.tasks} skillId={skill.id} onTasksUpdated={onTasksUpdated} />
        </TabsContent>
        <TabsContent value="reflections">
          <ReflectionsList reflections={skill.reflections} skillId={skill.id} />
        </TabsContent>
      </Tabs>

      {showModal && (
        <AddSkillModal
          skill={skill}
          onClose={() => setShowModal(false)}
          onSkillUpdated={() => mutate()}
        />
      )}
    </div>
  );
}
