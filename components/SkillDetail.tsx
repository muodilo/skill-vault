"use client";

import { useEffect, useState, useCallback } from "react";
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

export default function SkillDetail({ skillId }: { skillId: string }) {
  const [skill, setSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchSkill = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/skills/${skillId}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch skill: ${res.statusText}`);
      }
      const data = await res.json();
      setSkill(data);
    } catch (err: unknown) {
      console.error("Error fetching skill:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      setSkill(null);
    } finally {
      setLoading(false);
    }
  }, [skillId]);
  const onTasksUpdated = ()=>{
    fetchSkill();
  }

  useEffect(() => {
    fetchSkill();
  }, [fetchSkill]);

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

  if (loading) return (
  <div className="pt-5">
    <div className="skeleton w-full mb-7  h-44 bg-slate-200 rounded-lg  animate-pulse">
    </div>
    <div className="skeleton w-full  h-96 bg-slate-200 rounded-lg  animate-pulse">
    </div>

  </div>
  );
  if (error) return <p className="text-red-600">{error}</p>;
  if (!skill) return <p>Skill not found.</p>;

  const totalTasks = skill.tasks.length;
  const completedTasks = skill.tasks.filter((t) => t.completed).length;
  const progress = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

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
            <FcTodoList/>
            <p>Tasks</p>
            </TabsTrigger>
          <TabsTrigger value="reflections">
            <FaBook/>
            <p>Reflections</p> 
            </TabsTrigger>
        </TabsList>
        </div>
        <TabsContent value="tasks">
          <TasksList onTasksUpdated={onTasksUpdated} tasks={skill.tasks} skillId={skill.id} />
        </TabsContent>
        <TabsContent value="reflections">
            <ReflectionsList  reflections={skill.reflections} skillId={skill.id} />
        </TabsContent>
      </Tabs>

      {showModal && (
        <AddSkillModal
          skill={skill}
          onClose={() => setShowModal(false)}
          onSkillUpdated={fetchSkill}
        />
      )}
    </div>
  );
}
