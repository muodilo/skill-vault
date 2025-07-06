"use client";

import { useState, useEffect } from "react";
import { Task } from "@/types/skill";

export default function EditTaskModal({
  task,
  onClose,
  onTaskUpdated,
}: {
  task: Task | null;
  onClose: () => void;
  onTaskUpdated: () => void;
}) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
    }
    setError(null);
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/tasks/${task?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      if (!res.ok) {
        throw new Error("Failed to update task");
      }

      onTaskUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to update task. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!task) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow">
        <h2 className="text-lg font-semibold mb-4">Edit Task</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Task title"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
              disabled={loading}
            >
              {loading ? "Saving..." : "Update Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
