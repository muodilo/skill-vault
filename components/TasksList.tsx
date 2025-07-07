"use client";

import { useState } from "react";
import { Task } from "@/types/skill";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import EditTaskModal from "./tasks/EditTaskModal";
import { IoMdAdd } from "react-icons/io";
import { ImSpinner2 } from "react-icons/im";

export default function TasksList({
  tasks,
  skillId,
  onTasksUpdated,
}: {
  tasks: Task[];
  skillId: string;
  onTasksUpdated: () => void;
}) {
  const [taskName, setTaskName] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [togglingTaskId, setTogglingTaskId] = useState<string | null>(null);

  const handleAddTask = async () => {
    if (!taskName.trim()) return;

    setLoading(true);
    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: taskName, skillId }),
      });
      setTaskName("");
      onTasksUpdated();
    } catch (err) {
      console.error(err);
      alert("Error saving task");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this task?")) return;

    try {
      await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      onTasksUpdated();
    } catch (err) {
      console.error(err);
      alert("Failed to delete task");
    }
  };

  const handleToggleComplete = async (task: Task) => {
    setTogglingTaskId(task.id);
    try {
      await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed }),
      });
      onTasksUpdated();
    } catch (err) {
      console.error(err);
      alert("Failed to update task");
    } finally {
      setTogglingTaskId(null);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Tasks</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter task name..."
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        />
        <button
          onClick={handleAddTask}
          disabled={loading}
          className="bg-blue-600 flex-nowrap h-10 w-10 text-white px-3 py-1 rounded"
        >
          {loading ? (
            <ImSpinner2 className="animate-spin" />
          ) : (
            <IoMdAdd className="cursor-pointer" />
          )}
        </button>
      </div>

      <ul>
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex justify-between items-center border-b py-2"
          >
            <div className="flex items-center gap-2">
              <button
                className="flex items-center gap-1"
                onClick={() => handleToggleComplete(task)}
                disabled={togglingTaskId === task.id}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  readOnly
                />
                {togglingTaskId === task.id && (
                  <ImSpinner2 className="animate-spin text-sm" />
                )}
              </button>

              <span
                className={task.completed ? "line-through text-gray-500" : ""}
              >
                {task.title}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setEditingTask(task)}
                title="Edit"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(task.id)}
                title="Delete"
              >
                <MdDelete />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onTaskUpdated={onTasksUpdated}
        />
      )}
    </div>
  );
}
