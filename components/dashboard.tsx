"use client";

import { FaBook } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import { MdOutlineWatchLater } from "react-icons/md";
import { FcTodoList } from "react-icons/fc";
import useSkills from "@/hooks/useSkills";

export default function DashboardStats() {
  const { skills, isLoading, error } = useSkills();

  const totalSkills = skills?.length || 0;
  const completedSkills =
    skills?.filter((s) => s.tasks.length > 0 && s.tasks.every((t) => t.completed)).length || 0;
  const inProgressSkills = totalSkills - completedSkills;
  const totalTasks = skills?.reduce((sum, s) => sum + s.tasks.length, 0) || 0;

  if (isLoading) {
    return (
      <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4 mb-16">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="bg-gray-200 animate-pulse h-32 rounded-lg shadow"
          ></div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-600">Error loading dashboard stats.</p>;
  }

  return (
    <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
      <div className="border rounded-xl p-5 shadow flex items-center justify-between">
        <div>
          <p className="text-neutral-500">Total Skills</p>
          <h1 className="text-3xl font-semibold">{totalSkills}</h1>
        </div>
        <div className="bg-primaryColor/10 p-2 rounded">
          <FaBook className="text-2xl text-primaryColor" />
        </div>
      </div>

      <div className="border rounded-xl p-5 shadow flex items-center justify-between">
        <div>
          <p className="text-neutral-500">Completed</p>
          <h1 className="text-3xl font-semibold">{completedSkills}</h1>
        </div>
        <div className="bg-green-500/10 p-2 rounded">
          <TiTick className="text-2xl text-white bg-green-500 rounded-full" />
        </div>
      </div>

      <div className="border rounded-xl p-5 shadow flex items-center justify-between">
        <div>
          <p className="text-neutral-500">In Progress</p>
          <h1 className="text-3xl font-semibold">{inProgressSkills}</h1>
        </div>
        <div className="bg-yellow-500/10 p-2 rounded">
          <MdOutlineWatchLater className="text-2xl bg-yellow-500 text-white p-1 rounded-full" />
        </div>
      </div>

      <div className="border rounded-xl p-5 shadow flex items-center justify-between">
        <div>
          <p className="text-neutral-500">Total Tasks</p>
          <h1 className="text-3xl font-semibold">{totalTasks}</h1>
        </div>
        <div className="bg-primaryColor/10 p-2 rounded">
          <FcTodoList className="text-2xl text-primaryColor" />
        </div>
      </div>
    </div>
  );
}
